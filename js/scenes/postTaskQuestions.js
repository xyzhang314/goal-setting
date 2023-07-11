// Scene to hold post-task questions, routes participants to the Game End scene

// import js game element modules (sprites, ui, outcome animations)
import MultipleChoicePanel from "../elements/multipleChoicePanel.js";

// import our custom events centre for passing info between scenes
import eventsCenter from '../eventsCenter.js'

// import relevant data saving function
//import { savePostTaskData } from "../saveData.js";

// initialise global saving vars
var gamePhase; var questName; var questionNo; var questionText;

// this function extends Phaser.Scene and includes the core logic for the scene
export default class PostTaskQuestions extends Phaser.Scene {
    constructor() {
        super({
            key: 'PostTaskQuestions'
        });
    }

    preload() {
        
    }
    
    create() {
        // sizing vars
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;

        // quest and task stage vars
        gamePhase = 'postTask0';
        questName = 'PHQstate';

        ///////////////////QUEST1////////////////////
        var titleText = '现在你有没有...';
        questionText = ('[color=#111]做事时提不起劲或没有兴趣？[/color]\n'
                   );
        questionNo = 1;
        var responseOptions = ['完全没有', '有点', '中等程度', '非常明显'];
        this.mcPanel = new MultipleChoicePanel(this, 
                                               gameWidth/2, gameHeight/2,
                                               questName, titleText, questionNo, 
                                               questionText, responseOptions, gamePhase, false);

        ///////////////////QUEST2////////////////////
        eventsCenter.once(gamePhase+questName+'1complete', function () {
            //savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('[color=#111]感到心情低落、沮丧或绝望[/color]\n'
                       );
            questionNo = 2;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST3////////////////////
        eventsCenter.once(gamePhase+questName+'2complete', function () {
            //savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('[color=#111]感觉疲惫或没有活力[/color]\n'
                       );
            questionNo = 3;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST4////////////////////
        eventsCenter.once(gamePhase+questName+'3complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('[color=#111]觉得自己很糟或觉得自己很\n'+
                       '失败，或让自己、家人失望[/color]\n'
                       );
            questionNo = 4;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST5////////////////////
        eventsCenter.once(gamePhase+questName+'4complete', function () {
            //savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('[color=#111]对事物专注有困难，例如看书、看电视时?[/color]\n'
                       );
            questionNo = 5;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST6////////////////////
        eventsCenter.once(gamePhase+questName+'5complete', function () {
            // savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('[color=#111]行动或说话速度缓慢到别人已经察觉[/color]\n'
                       );
            questionNo = 6;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST7////////////////////
        eventsCenter.once(gamePhase+questName+'6complete', function () {
            // savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('[color=#111]变得比平常更烦躁或坐立不安[/color]\n'
                       );
            questionNo = 7;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        // end scene
        eventsCenter.once(gamePhase+questName+'7complete', function () {
            // savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            this.nextScene();
            }, this);
       
    }
        
    update(time, delta) {
    }

    nextScene() {
        this.scene.start('InterventionScene');
    } 
}

