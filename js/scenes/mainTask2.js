// Scene to hold the task. Routes to Task End Scene

// import js game element modules (sprites, ui, outcome animations, etc.)
import Player from "../elements/player.js";
import Coins from "../elements/coins.js";
import SetGoalPanel from "../elements/setGoalPanel.js";       
import ControlPanel from "../elements/controlPanel.js";
import ChoicePanel from "../elements/choicePanel.js";       
import TimerPanel from "../elements/timerPanelClicks.js";
import EndOfBlockPanel from "../elements/endOfBlockPanel.js";
import EndOfBlockPanelPlan from "../elements/endOfBlockPanelPlan.js";
import QuestionPanel from "../elements/questionPanel.js";

// import our custom events center for passsing info between scenes and relevant data saving function
import eventsCenter from '../eventsCenter.js'
import { saveTask1Data, savePostTaskData, saveIntervData } from "../saveData.js";

// import effort info from versionInfo file
import { effortTime, minPressMax, nBlocks, debugging, maxRews, taskConds } from "../versionInfo.js"; 

// initialize some global game vars
var gameHeight;
var gameWidth;
var mapWidth;
var platforms;
var bridge;
const decisionPointX = 370;    // where the choice panel will be triggered (x coord in px)
const midbridgeX = 735;        // where trial2 reward coins will be displayed (x coord in px)
const endbridgeX = 960;        // where the player must jump up to cross bridge (x coord in px)
const playerVelocity = 1000;   // baseline player velocity (rightward)
// initialize task vars
var nTrials2;
var trial2 = 0;
var trialReward1;
var trialEffort1; var trialEffortPropMax1;
var trialReward2; var trialEffortPropMax2;
var trialEffort2;
var nCoins = 0;
var coinsText;
var feedback;
var feedbackTime = 1000;
var blockLength;
var block2 = 0;
// initialize timing and response vars
var trialStartTime;
var choicePopupTime;
var choice;
var choiceCompleteTime;
var choiceRT;
var pressCount;
var pressTimes;
var trialSuccess;
var trialEndTime;
const practiceOrReal = 1;      
// initialize task condition variables (can be "baseline", "control", or "planning")
var taskType;                
let taskN = 1;
var gamePhase;
var blockGoal;
var goalProgress = 0;
var goalProgressBar;
var barWidth = 140;
var barHeight = 40;
var progressText;
var prTxt = "            目标\n            进度";

// this function extends Phaser.Scene and includes the core logic for the game
export default class MainTask2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainTask2'
        });
    }

    preload() {
        ////////////////////PRELOAD GAME ASSETS///////////////////////////////////
        // load tilemap and tileset created using Tiled (see below)
        this.load.tilemapTiledJSON('map', './assets/tilemaps/tilemap-main.json'); 
        this.load.image('tiles', './assets/tilesets/tiles_edited_70px_extruded.png');

        // load player sprite
        this.load.spritesheet('player', './assets/spritesheets/player1.png', { 
            frameWidth: 90, 
            frameHeight: 96
        });
        
        // load cloud and bush sprites to add some texture to background
        this.load.image('cloud1', './assets/imgs/cloud1.png');
        this.load.image('bush', './assets/imgs/bush.png');
        this.load.image('button', './assets/imgs/button.png');
        this.load.image('sign', './assets/imgs/sign.png');       // and sign for decision point

        // load animated coin sprite (these will represent offered reward level)
        this.load.spritesheet('coin', './assets/spritesheets/coin.png', { 
            frameWidth: 15.8, 
            frameHeight: 16 
        });
        
        // load trial2 type info from json array
        this.load.json('trials', './assets/trials.json');
    }
    
    create() {
        ////////////////////////CREATE WORLD//////////////////////////////////////
        // game world created in Tiled (https://www.mapeditor.org/)
        // import tilemap
        var map = this.make.tilemap({ key: "map" });
        var tileset = map.addTilesetImage("tiles_edited_70px_extruded", "tiles"); // first arg must be name used for the tileset in Tiled

        // grab some size variables that will be helpful later
        gameHeight = this.sys.game.config.height;
        gameWidth = this.sys.game.config.width;
        mapWidth = map.widthInPixels;

        // import scene layers (using names set up in Tiled)
        platforms = map.createStaticLayer("platforms", tileset, 0, 0);
        bridge = map.createStaticLayer("bridge", tileset, 0, 0);
        
        // set up collision property for tiles that can be walked on (set in Tiled)
        platforms.setCollisionByProperty({ collide: true });
        bridge.setCollisionByProperty({ collide: true });

        // add cloud and bush sprites for texture (randomly positioned on each trial2)
        this.clouds = this.physics.add.staticGroup();
        for (var i = 0; i < 4; i++) {
            var x = Phaser.Math.RND.between(0, mapWidth);
            var y = Phaser.Math.RND.between(0, gameHeight/3);  // only in top third
            this.clouds.create(x, y, 'cloud1');
        }
        this.bushes = this.physics.add.staticGroup();
        for (var i = 0; i < 5; i++) {
            var x = Phaser.Math.RND.between(0, mapWidth);
            var y = gameHeight/2 + 40;        // only at ground height
            if ( x <  280 || x > 1000) {       // only place on grass tiles
                this.bushes.create(x, y, 'bush').setScale(0.5).refreshBody();
            }
        }
        this.sign = this.add.image(decisionPointX, gameHeight/2+18, 'sign');
        
        // set the boundaries of the world
        this.physics.world.bounds.width = mapWidth;
        this.physics.world.bounds.height = gameHeight;

        //////////////ADD PLAYER SPRITE////////////////////
        this.player = new Player(this, 0, 200); // (this, spawnPoint.x, spawnPoint.y);
        this.physics.add.collider(this.player.sprite, platforms); 
        this.physics.add.collider(this.player.sprite, bridge);       // player walks on platforms and bridge
        this.player.sprite.setVelocityX(0);
        this.player.sprite.anims.play('wait', true);

        //////////////CONTROL CAMERA///////////////////////
        this.cameras.main.startFollow(this.player.sprite);           // camera follows player
        this.cameras.main.setBounds(0, 0, mapWidth, gameHeight);

        //////////////////////////TRIAL2 CONTROL POINTS///////////////////////////
        // 0. First, let's add some invisible to sprites regions of space that key trial2 
        // events depend on, so that our player can collide (interact) with them
        // 0.1 point where the choice panel is triggered:
        this.decisionPoint = this.physics.add.sprite(decisionPointX, gameHeight/2);   
        this.decisionPoint.displayHeight = gameHeight;  
        this.decisionPoint.immovable = true;
        this.decisionPoint.body.moves = false;
        this.decisionPoint.allowGravity = false;
        // 0.2 end of bridge where our little man requires a gravity boost (reject & unsuccessful trials):
        this.bridgeEndPoint = this.physics.add.sprite(endbridgeX, gameHeight/2);
        this.bridgeEndPoint.displayHeight = gameHeight;  
        this.bridgeEndPoint.immovable = true;
        this.bridgeEndPoint.body.moves = false;
        this.bridgeEndPoint.allowGravity = false; 
        // 0.3 point where a new trial2 is triggered:
        this.trialEndPoint = this.physics.add.sprite(mapWidth-20, gameHeight/2);
        this.trialEndPoint.displayHeight = gameHeight;  
        this.trialEndPoint.immovable = true;
        this.trialEndPoint.body.moves = false;
        this.trialEndPoint.allowGravity = false;   
        
        // 1. Upon entering scene, player moves right until they encounter the decisionPoint
        if (trial2 > 0 ) {
            this.player.sprite.setVelocityX(playerVelocity*2.5);  // positive X velocity -> move R
            this.player.sprite.anims.play('run', true);
        }
        this.physics.add.collider(this.player.sprite, this.decisionPoint, 
                          function(){ eventsCenter.emit('choicePanelOn2'); }, null, this); // once the player has collided with invisible decision point, emit event

        // once this event is detected, perform the function displayChoicePanel (only once)
        eventsCenter.once('choicePanelOn2', displayChoicePanel2, this);  
        
        // 2. After trial2 outcome (reject, accept+successful, accept+unsuccessful), 
        // player moves right again until they encounter the trial2 end point
        this.physics.add.collider(this.player.sprite, this.trialEndPoint, 
                          function(){ eventsCenter.emit('trialEndHit2'); }, null, this); // once the player has collided with invisible trial2 end point, emit event
        // once this event us detected, perform the function trialEnd (only once)
        eventsCenter.once('trialEndHit2', trialEnd2, this);
        
        // // 3. if desired, add listener functions to pause game when focus taken away
        // // from game browser tab/window [necessary for mobile devices]
        // window.addEventListener('blur', () => { 
        //     //console.log('pausing game content...');      // useful for debugging pause/resume
        //     this.scene.pause();
        // }, false);
        // // and resume when focus returns
        // window.addEventListener('focus', () => { 
        //     setTimeout( () => { 
        //         //console.log('resuming game content...'); 
        //         this.scene.resume();
        //     }, 250); 
        // }, false);
        
        ///////////INSTRUCTIONS & SCORE TEXT///////////////
        // add coin count text in a fixed position on the screen
        coinsText = this.add
            .text(gameWidth-160, 16, "金币："+nCoins, {
                //font: "18px monospace",
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                fill: "#FFD700",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);
        ////////////CONDITION-DEPENDENT CONTENT///////////////
        //taskN = this.registry.get('taskN'); console.log(taskN);
        taskType = taskConds[taskN]; console.log(taskType);
        if (taskType == "planning") {
            // progress-to-goal bar (x, y, width, height, colour)
            let bar = this.add.rectangle(decisionPointX+110, 16, barWidth, barHeight, 0x000000) // draw black background
            .setStrokeStyle(2, 0xFFD700)    // with yellow outline 
            .setOrigin(0,0)                                     
            .setScrollFactor(0); 
            // with yellow in-fill dependent on progress towards goal
            goalProgressBar = this.add.rectangle(decisionPointX+113, 18, Math.round(goalProgress*(barWidth-6)), barHeight-4, 0xFFD700) // initialize at zero
            .setOrigin(0,0) 
            .setScrollFactor(0); 
            progressText = this.add.text(decisionPointX+16, 18, prTxt, {color: "#000000",fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',})
            .setAlign('center')
            .setScrollFactor(0);
            // if first trial2, set goal for this block2
            if (trial2 == 0) {
                // make player wait and popup goal-setting panel
                this.goalPanel = new SetGoalPanel(this, gameWidth/2, gameHeight/2, block2, maxRews[block2]);   
                // then grab set goal for this block2 and allow game to continue
                eventsCenter.once('block'+block2+'goalset', 
                    function(){ blockGoal = this.registry.get('block'+block2+'goal');  // get goal for this block2
                                saveIntervData('block'+block2+'goal', blockGoal);
                                // restart player
                                this.player.sprite.setVelocityX(150);  // positive X velocity -> move R
                                this.player.sprite.anims.play('run', true); 
                               }, this)
            }
        } else if (trial2 == 0) {
            //this.physics.pause();
            this.likingPanel = new ControlPanel(this, gameWidth/2, gameHeight/2, block2);     
            // then allow game to continue
            eventsCenter.once('block'+block2+'answered', 
                function(){ let gameLiking = this.registry.get('block'+block2+'answer');   
                            saveIntervData('block'+block2+'answer', gameLiking);
                            // restart player
                            this.player.sprite.setVelocityX(150);  // positive X velocity -> move R
                            this.player.sprite.anims.play('run', true); 
                           }, this)
        }

        /////////////UI: CHOICES AND RATINGS///////////////
        // UI functionality built using Rex UI plugins for phaser3 
        // (see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/). 
        // These plugins are globally loaded from the min.js src in index.html
        
        //////////////////////////GET TRIAL2 INFO//////////////////////////////////  
        // load trial2 info (must be done within create())
        let trials = this.cache.json.get('trials');
        if (debugging == false) {
            nTrials2 = trials.reward1.length;
        } else {
            nTrials2 = 8; //trials.reward1.length; 
        }
        blockLength = Math.round(nTrials2/nBlocks);   
        
        // get max press count from practice/callibration round
        let maxPressCount = this.registry.get('maxPressCount'); 
        if (debugging == false) { 
            // and enforce minimum to guard against gaming
            if (maxPressCount < minPressMax) {
                maxPressCount = minPressMax;
            }
        } else {
           maxPressCount = 55;
        }
        // set the two trial2 options info from trial2 number
        // effort values are now coded as proportions of max press count (max=0.95)
        trialReward1 = trials.reward1[trial2];
        trialEffortPropMax1 = trials.effort1[trial2];
        trialEffort1 = Math.round(trialEffortPropMax1*maxPressCount); 
        trialReward2 = trials.reward2[trial2];
        trialEffortPropMax2 = trials.effort2[trial2];
        trialEffort2 = Math.round(trialEffortPropMax2*maxPressCount); 
        
        // log trial2 start time
        trialStartTime = Math.round(this.time.now);
        
    }
    
    update(time, delta) {
        ///////////SPRITES THAT REQUIRE TIME-STEP UPDATING FOR ANIMATION//////////
        this.player.update(); 
        
        ////////////MOVE ON TO NEXT SCENE WHEN ALL TRIALS HAVE RUN////////////////
        if (trial2 == nTrials2) {
            this.nextScene();
        }
    }
    
    nextScene() {
        this.scene.start('TaskEndScene2');
    }
}

///////////////////////////////FUNCTIONS FOR CONTROLLING TRIAL2 SEQUENCE/////////////////////////////////////
// 1. Once player has hit the decision point, pop up the choice panel with info for that trial2
var displayChoicePanel2 = function () {
    // record time
    choicePopupTime = this.time.now; 
    // update some stuff (stop player moving and remove decisionPoint sprite)
    this.player.sprite.setVelocityX(0);
    this.player.sprite.anims.play('wait', true); 
    this.decisionPoint.destroy();
    
    // display reward coins for each option
    this.coins1 = new Coins(this, midbridgeX-(trialReward1*30)/2, 115, trialReward1); // coins in sky
    this.coins2 = new Coins(this, midbridgeX-(trialReward2*30)/2, 285, trialReward2); // coins on bridge
    
    // popup choice panel with relevant trial2 info
    this.choicePanel = new ChoicePanel(this, gameWidth/2, gameHeight/2-140, 
                                       trialReward1, trialEffortPropMax1, trialEffort1, 
                                       trialReward2, trialEffortPropMax2, trialEffort2); 
    
    // once choice is entered, get choice info and route to relevant next step
    eventsCenter.once('choiceComplete', doChoice2, this);       
};

// 2. Once choice (to accept or reject proposed option) has been made, route to relevant components 
var doChoice2 = function () {
    // calculate decision RT
    choiceCompleteTime = this.time.now; 
    choiceRT = Math.round(choiceCompleteTime - choicePopupTime); 
    // and get info on chosen option
    choice = this.registry.get('choice');  
    
    // if participant chooses the high effort option
    if (choice == '路线 1') {      
        // timer panel pops up  
        this.timerPanel = new TimerPanel(this, gameWidth/2, gameHeight/2-160, effortTime, trialEffort1, practiceOrReal) 
        // and play player 'power-up' animation
        this.player.sprite.anims.play('powerup', true);
        // until time limit reached:
        eventsCenter.once('timesup', effortOutcome2, this)
        }
    else {  // if participant chooses the low effort option
        // timer panel pops up  
        this.timerPanel = new TimerPanel(this, gameWidth/2, gameHeight/2-160, effortTime, trialEffort2, practiceOrReal) 
        // and play player 'power-up' animation
        this.player.sprite.anims.play('powerup', true);
        // until time limit reached:
        eventsCenter.once('timesup', effortOutcome2, this)
    }
};

// 3. If participant accepts effort proposal, record button presses and see if they meet threshold
var effortOutcome2 = function() {
    // get number of achieved button presses 
    pressCount = this.registry.get('pressCount');
    pressTimes = this.registry.get('pressTimes');  // [?we want this - might make code run slow...]
    
    // if ppt chooses high effort and clears trial2 effort threshold, fly across sky and collect coins!
    if (choice == '路线 1' && pressCount >= trialEffort1) {
        trialSuccess = 1;
        // add overlap colliders so coins disappear when overlap with player body
        this.physics.add.overlap(this.player.sprite, this.coins1.sprite, collectCoins2, null, this); 
        // display success message for a couple of seconds,
        feedback = this.add.text(gameWidth/2, gameHeight/2-160,  
                                 "呜呼~你成功啦！", {
                                    //font: "20px monospace",
                                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#1ea7e1"
                                 })
            .setOrigin(0.5, 1);
        this.tweens.add({        
            targets: feedback,
            scaleX: { start: 0, to: 1 },
            scaleY: { start: 0, to: 1 },
            ease: 'Back',    
            duration: feedbackTime,
            repeat: 0,      
            yoyo: true
        });
        // then player floats across 'high route' and collects coins
        this.time.addEvent({delay: feedbackTime, 
                            callback: function(){
                                feedback.destroy();
                                this.player.sprite.anims.play('float', true);    
                                this.player.sprite.setVelocityX(playerVelocity/3);
                                this.time.addEvent({ delay: 150, 
                                                     callback: function(){this.player.sprite.setVelocityY(-230);},
                                                     callbackScope: this, 
                                                     repeat: 5 });
                            },
                            callbackScope: this});
    }
    // if ppt chooses low effect and clears trial2 effort threshold, fly across mid-sky and collect coins!
    else if (choice == '路线 2' && pressCount >= trialEffort2)  {
        trialSuccess = 1;
        // add overlap colliders so coins disappear when overlap with player body
        this.physics.add.overlap(this.player.sprite, this.coins2.sprite, collectCoins2, null, this); 
        // display success message for a couple of seconds,
        feedback = this.add.text(gameWidth/2, gameHeight/2-160,  
                                 "呜呼~你成功啦！", {
                                    //font: "20px monospace",
                                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#1ea7e1"
                                 })
            .setOrigin(0.5, 1);
        this.tweens.add({        
            targets: feedback,
            scaleX: { start: 0, to: 1 },
            scaleY: { start: 0, to: 1 },
            ease: 'Back',    
            duration: feedbackTime,
            repeat: 0,      
            yoyo: true
        });
        // then player floats across 'low route' and collects coins
        this.time.addEvent({delay: feedbackTime, 
                            callback: function(){
                                feedback.destroy();
                                this.player.sprite.anims.play('float', true);    
                                this.player.sprite.setVelocityX(playerVelocity/3);
                                this.time.addEvent({ delay: 150, 
                                                     callback: function(){this.player.sprite.setVelocityY(-100);},
                                                     callbackScope: this, 
                                                     repeat: 8 });
                            },
                            callbackScope: this});
    } else {  // else if fail to reach trial2 effort threshold
        trialSuccess = 0;
        // display failure message for a couple of seconds
        feedback = this.add.text(gameWidth/2, gameHeight/2-160,  
                                 "真可惜，这次还不够快！", {
                                    //font: "20px monospace",
                                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#000000"
                                 })
            .setOrigin(0.5, 1);
        this.tweens.add({        
            targets: feedback,
            scaleX: { start: 0, to: 1 },
            scaleY: { start: 0, to: 1 },
            ease: 'Back',    
            duration: feedbackTime,
            repeat: 0,      
            yoyo: true
        });
        // then play powerup fail anim and progress via slow route
        this.time.addEvent({delay: feedbackTime+250, 
                            callback: function(){
                                feedback.destroy();
                                // then play short 'powerup fail' anim:
                                this.player.sprite.anims.play('powerupfail', true);
                                // and progress via bridge route (with sad face)
                                this.player.sprite.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                                    // player progresses via bridge and earns no extra reward
                                    this.player.sprite.setVelocityX(playerVelocity/5);   // 5,6
                                    this.player.sprite.anims.play('sadrun', true);
                                    this.physics.add.collider(this.player.sprite, this.bridgeEndPoint, 
                                                              function(){eventsCenter.emit('bumpme');}, null, this); 
                                    eventsCenter.once('bumpme', onejump, this);
                                    });
                            },                         
                            callbackScope: this});
    }
};

// 4. When player hits end of scene, save trial2 data and move on to the next trial2 (reload the scene)
var trialEnd2 = function () {
    // get trial2 end time
    trialEndTime = Math.round(this.time.now);
    // set data to be saved into registry
    this.registry.set("task"+taskN+"_trial"+trial2, {trialNo: trial2, 
                                                  trialStartTime: trialStartTime,
                                                  trialReward1: trialReward1,
                                                  trialEffort1: trialEffort1,
                                                  trialEffortPropMax1: trialEffortPropMax1,
                                                  trialReward2: trialReward2,
                                                  trialEffort2: trialEffort2,
                                                  trialEffortPropMax2: trialEffortPropMax2,
                                                  choice: choice,
                                                  choiceRT: choiceRT,
                                                  pressCount: pressCount,
                                                  pressTimes: pressTimes,
                                                  trialSuccess: trialSuccess,
                                                  coinsRunningTotal: nCoins,
                                                  trialEndTime: trialEndTime,
                                                  effortTimeLimit: effortTime,
                                                  condition: taskType
                                                 });
    // save data
    saveTask1Data("task"+taskN+"_trial"+trial2, this.registry.get(`task${taskN}_trial${trial2}`));   // [for LeanCloud]
    
    // if end of block2, display end of block2 screen
    if (((trial2+1) % blockLength == 0)) {
        this.player.sprite.setVelocityX(0);
        this.player.sprite.anims.play('wait', true);
        // get end of block ratings
        var _this = this;
        getBlockEndRatings2(_this);
        eventsCenter.once('task'+taskN+gamePhase+'question3complete', function () {
            // display end of block screen
            if (taskType == "planning") {
                this.breakPanel = new EndOfBlockPanelPlan(this, mapWidth-gameWidth/2, 300, nCoins, blockGoal);
            } else {
                this.breakPanel = new EndOfBlockPanel(this, mapWidth-gameWidth/2, 300, nCoins);
            };
            eventsCenter.once('breakover', function(){
                // iterate block2 and trial2 number
                block2++;
                trial2++;
                // restart coin total and goal progress from 0 after each block2
                nCoins = 0;
                goalProgress = 0;
                prTxt = "            目标\n            进度";
                // set goal or get control rating for next block2
                if (taskType == "planning") {
                    this.goalPanel = new SetGoalPanel(this, mapWidth-gameWidth/2, gameHeight/2, block2, maxRews[block2]);   
                    // then grab set goal for this block2 and allow game to continue
                    eventsCenter.once('block'+block2+'goalset', 
                        function(){ blockGoal = this.registry.get('block'+block2+'goal');  // get goal for this block
                                    saveIntervData('block'+block2+'goal', blockGoal); // console.log(blockGoal); 
                                    // then move on to next trial2
                                    this.scene.restart();}, this)
                } else {
                    this.likingPanel = new ControlPanel(this, mapWidth-gameWidth/2, gameHeight/2, block2);     
                    eventsCenter.once('block'+block2+'answered', 
                        function(){ let gameLiking = this.registry.get('block'+block2+'answer');  // get game liking control rating for this block
                                    saveIntervData('block'+block2+'answer', gameLiking); // console.log(gameLiking); 
                                    // move on to next trial2
                                    this.scene.restart();}, this) 
                }
            }, this);
        }, this);
    } else {
        // iterate trial2 number
        trial2++;                
        // move to next trial2
        this.scene.restart();        // [?wrap in delay function to ensure saving works]
    }  
};

// 5. At the end of the block, get within-block self-report ratings
var getBlockEndRatings2 = function (scene) {
        // let's do this a long-winded way for easiness...[should be a function]
        gamePhase = 'postBlock'+block2;
        ///////////////////QUESTION ONE////////////////////
        var mainTxt = '在刚才一轮游戏中，当你收集金币时\n'+
                      '你会感到多大的愉快感？\n\n\n'+
                      '请从 0 到 100 进行评分，其中\n'+ 
                      '\n'+
                      '0 = “完全没有”        100 = “非常明显”'
        var questionNo = 1;
        
        scene.questionPanel = new QuestionPanel(scene, mapWidth-gameWidth/2, 300,
                                               taskN, gamePhase, questionNo, mainTxt);
        // var coinImg = scene.add.image(mapWidth-gameWidth/2, gameHeight/2-49, 'coin');
        // coinImg.setScale(2);
        
        ///////////////////QUESTION TWO////////////////////
        eventsCenter.once('task'+taskN+gamePhase+'question1complete', function () {
            // coinImg.destroy();
            savePostTaskData('task'+taskN+'_'+gamePhase+'_'+questionNo, scene.registry.get(`task${taskN}${gamePhase}question${questionNo}`));     // [LeanCloud]
            mainTxt = '在刚才一轮游戏中，当你成功收集\n'+
                      '金币时,你会感到多大的成就感？\n\n\n'+
                      '请从 0 到 100 进行评分，其中\n'+ 
                      '\n'+
                      '0 = “完全没有”        100 = “非常明显”'
            questionNo = 2;
            
            scene.questionPanel = new QuestionPanel(scene, mapWidth-gameWidth/2, 300, 
                                                   taskN, gamePhase, questionNo, mainTxt);
            // coinImg = scene.add.image(mapWidth-gameWidth/2, gameHeight/2-49, 'coin');
            // coinImg.setScale(2);
        }, this);    

        ///////////////////QUESTION THREE////////////////////
        eventsCenter.once('task'+taskN+gamePhase+'question2complete', function () {
            // coinImg.destroy();
            savePostTaskData('task'+taskN+'_'+gamePhase+'_'+questionNo, scene.registry.get(`task${taskN}${gamePhase}question${questionNo}`));     // [LeanCloud]
            mainTxt = '在刚才一轮游戏中，当你收集金币时，\n'+
                      '你会感到有多无聊？\n\n\n'+
                      '请从 0 到 100 进行评分，其中\n'+ 
                      '\n'+
                      '0 = “完全没有”        100 = “非常明显”'
            questionNo = 3;
            
            scene.questionPanel = new QuestionPanel(scene, mapWidth-gameWidth/2, 300,
                                                   taskN, gamePhase, questionNo, mainTxt);
        }, this);       
        
        // end scene
        eventsCenter.once('task'+taskN+gamePhase+'question3complete', function () {
            // coinImg.destroy();
            savePostTaskData('task'+taskN+'_'+gamePhase+'_'+questionNo, scene.registry.get(`task${taskN}${gamePhase}question${questionNo}`));    // [LeanCloud]
        }, this);
};

//////////////////////MISC FUNCTIONS/////////////////////
// function to get player up other side of bridge by performing single jump
// used on reject and unsucessful accept trials
var onejump = function () {
    this.bridgeEndPoint.destroy();
    this.player.sprite.setVelocityY(-350);
    this.time.addEvent(750,  // also make a bit faster once over bridge [DOESN'T SEEM TO WORK]
                       function(){this.player.sprite.setVelocityX(playerVelocity*2);},
                       null, this);
};

// function to make coin sprites disappear upon contact with player
// (so player appears to 'collect' them)
var collectCoins2 = function(player, coin){
    // individual coins from group become invisible upon overlap
    coin.disableBody(true, true);         
    // update coins total and text 
    nCoins++; 
    coinsText.setText('金币：'+nCoins);
    // if planning condition, also update progress bar depending on progress towards goal
    if (taskType == "planning") {
        goalProgress = nCoins/blockGoal;
        if (nCoins >= blockGoal) {
            goalProgress = 1;
            prTxt = "      目标\n          达成！";
            progressText.setText(prTxt);
        }
        goalProgressBar.setDisplaySize(Math.round(goalProgress*(barWidth-6)), barHeight-4);
    }
};