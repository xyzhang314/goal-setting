// Scene to hold multi-page intervention text

// import js game element modules (sprites, ui, outcome animations)
import InstructionsPanel from "../elements/instructionsPanel.js";
import MultipleChoicePanel from "../elements/multipleChoicePanel.js";

// import randomisation condition
import { randCond } from "../versionInfo.js";

// import our custom events center for passsing info between scenes and data saving function
import eventsCenter from "../eventsCenter.js";
import { saveQuizData } from "../saveData.js";

// initialize intervention-condition specific text vars
var intTitleText; var intText1; var intText2; var intTitleText2;
var intQuizText; var intQuizOptions;

// this function extends Phaser.Scene and includes the core logic for the scene
export default class InterventionScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'InterventionScene'
        });
    }

    preload() {
        // load cloud sprites to add texture to background
        this.load.image('cloud1', './assets/imgs/cloud1.png');
    }
    
    create() {
        // load a few cloud sprites dotted around and set sizing vars
        const cloud1 = this.add.sprite(180, 100, 'cloud1');
        const cloud2 = this.add.sprite(320, 540, 'cloud1');
        const cloud3 = this.add.sprite(630, 80, 'cloud1');
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;

        // get time;
        // saveTaskData('interventionStartTime', Math.round(this.time.now));

        // set text depending on randomization condition
        if (randCond == "planning") {
            intTitleText = '目标设定应量力而行';
            intText1 =  '设定 [b]切实可行的目标[/b] 能够\n'+
                        '激励我们朝着最终的目标努力。\n\n'+

                        '当设定的目标过高，我们通常需要在极短\n'+
                        '的时间内完成超负荷的任务。如果最终目\n'+
                        '标没有达成，我们会感到很大的挫败感。\n'+
                        '另一方面，如果完全不设定目标那么我们\n'+
                        '很少有动力去完成任务。\n\n'+

                        '  设定一个高要求但是 [b]切实可行[/b] 的目标， \n'+
                        '  当目标实现时，我们通常会体会到 [b]成就感[/b]，  \n'+
                        '  这种感觉会 [b]激励[/b]我们朝着终极目标努力。 \n'+
                        '  从长远来看，相比于目标设定过高和不设  \n'+
                        '  定目标，这种方式更能够让我们取得进步。 \n';
            intQuizText = '[color=#111]下列哪项陈述能够 [b]最恰当地[/b]\n'+
                          '总结你刚才阅读的内容？\n\n'+
                          '  [b]A[/b]. 完全不设定目标很有可能让我们成功。 \n\n'+
                          '  [b]B[/b]. 设定过高的目标是完成任务的好方法。 \n\n'+
                          '  [b]C[/b]. 设定一个高标准但是很可能实现的目标  \n'+
                          '会让我们保持积极性。\n\n'+
                          '  [b]D[/b]. 在极短的时间内完成超负荷的任务能够  \n'+
                          '帮助我们实现目标。\n\n';
            intQuizOptions = ['A', 'B', 'C', 'D'];
            intTitleText2 = '新游戏';
            intText2 =  ' 接下来，你需要再玩一次刚才 \n'+
                        ' 的游戏。但是这次，在每轮游 \n'+
                        ' 戏开始前，你需要 [b]设定目标[/b]。\n';
        } else {
            intTitleText = '你喜欢玩游戏吗？';
            intText1 =  '人们对于 [b]不同类型的\n'+
                        '网页游戏[/b] 都有自己的喜好。\n\n'+
                        ' 有些人喜欢玩需要快速反应的游戏，认为 \n'+
                        ' 这类游戏很有挑战，但有些人并不喜欢。 \n\n'+

                        '同样地，有些人在拼图游戏中\n'+
                        '能获得最大的 [b]成就感[/b]，\n'+
                        '而有些人认为这类游戏很无聊\n\n'+

                        '尽管我们对游戏都有个人偏好，但是在\n'+
                        '玩自己喜欢的游戏时，游戏带给我们的\n'+
                        '体验能够 [b]驱使我们继续玩下去[/b]。\n';

            intQuizText = '[color=#111]下列哪项陈述能够 [b]最恰当地[/b]\n'+
                          '总结你刚才阅读的内容？\n\n'+
                          '[b]A[/b]. 所有类型的游戏都深受大家的喜爱。\n\n'+
                          '[b]B[/b]. 人们通常不喜欢需要快速反应的游戏。\n\n'+
                          '[b]C[/b]. 每个人都有自己喜欢和不喜欢的游戏。\n\n'+
                          '[b]D[/b]. 人们都不喜欢玩拼图类游戏，因为这类\n'+
                          '游戏非常无聊。\n\n';
            intQuizOptions = ['A', 'B', 'C', 'D'];
            intTitleText2 = '新游戏';
            intText2 =  '  接下来，你需要再玩一次刚才  \n'+
                        '  的游戏。但是这次，在每轮游  \n'+
                        '  戏开始前，你需要对 [b]不同类型  \n'+
                        '  的游戏进行喜爱度的评分。 [/b] \n';
        }
        
        // let's do this the long-winded way for now...[should make this a function]
        ///////////////////PAGE ONE////////////////////
        var pageNo = 1;
        this.interventionPanel = new InstructionsPanel(this, 
                                                       gameWidth/2, gameHeight/2,
                                                       pageNo, intTitleText, intText1, "下一页");
        ///////////////////QUIZ////////////////////
        var questionNo = 1;
        var questName = 'interventionQuiz';
        var titleText = '小测验！';
        var gamePhase = 'postIntervention';
        eventsCenter.once('page1complete', function () {
            this.interventionQuiz = new MultipleChoicePanel(this, gameWidth/2, gameHeight/2,
                                                            questName, titleText, questionNo, 
                                                            intQuizText, intQuizOptions, gamePhase, true);
        }, this);

        eventsCenter.on('goback', function () {
            this.interventionPanel = new InstructionsPanel(this, 
                                               gameWidth/2, gameHeight/2,
                                               pageNo, intTitleText, intText1, "继续");
        }, this);
        
        ///////////////////PAGE TWO////////////////////
        eventsCenter.once(gamePhase+questName+'1complete', function () {
            saveQuizData(this.registry.get('postInterventioninterventionQuiz1')); //小测验的回答
            // saveTaskData('interventionQuizAnswer', this.registry.get(`${gamePhase}${questName}${questionNo}`));
            // saveTaskData('interventionQuizCompleteTime', Math.round(this.time.now));
            pageNo = 2;
            this.interventionPanel = new InstructionsPanel(this, 
                                                           gameWidth/2, gameHeight/2,
                                                           pageNo, intTitleText2, intText2, "开始游戏");
            }, this);
        
        // end scene
        eventsCenter.once('page2complete', function () {
            this.nextScene();
            }, this);
    }
    
    update(time, delta) {
    }
    
    nextScene() {
        this.scene.start('MainTask2');
    } 
}