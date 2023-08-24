// Scene to hold multi-page instructions text

// import js game element modules (sprites, ui, outcome animations)
import InstructionsPanel from "../elements/instructionsPanel.js";

// import our custom events centre for passsing info between scenes and data saving function
import eventsCenter from "../eventsCenter.js";
import { saveStartData } from "../saveData.js";

// initialize global start time var
var startTime;

// this function extends Phaser.Scene and includes the core logic for the scene
export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'InstructionsScene',
            autoStart: true
        });
    }

    preload() {
        // load cloud sprites to add texture to background
        this.load.image('cloud1', './assets/imgs/cloud1.png');
        // load button and coin sprites
        this.load.image('button', './assets/imgs/button.png');
        this.load.spritesheet('coin', './assets/spritesheets/coin.png', { 
            frameWidth: 15.8, 
            frameHeight: 16 
        });
    }
    
    create() {
        // load a few cloud sprites dotted around
        const cloud1 = this.add.sprite(180, 100, 'cloud1');
        const cloud2 = this.add.sprite(320, 540, 'cloud1');
        const cloud3 = this.add.sprite(630, 80, 'cloud1');
        
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        
        var titleText = '欢迎来到游戏！'

        startTime = Math.round(this.time.now);
        
        // let's do this the long-winded way for now...[should make this a function]
        ///////////////////PAGE ONE////////////////////
        var mainTxt = ("  你正在穿越一片覆盖有河流的陌生土地...  \n\n"+

                        "在每一次旅途的起点，你都将\n"+
                        "使用 [b]神奇雨伞[/b] 来帮助你飞跃河流！\n\n"+

                        " 在每次的起点位置，你需要 \n"+
                        " 在 [b]两条不同路线[/b] 之间进行 [b]选择[/b]。\n");
        var buttonTxt = "下一页";
        var pageNo = 1;
        this.instructionsPanel = new InstructionsPanel(this, 
                                                       gameWidth/2, gameHeight/2,
                                                       pageNo, titleText, mainTxt, buttonTxt);
        
        ///////////////////PAGE TWO////////////////////
        eventsCenter.once('page1complete', function () {
            mainTxt = ("在每条路线上，你都可以收集 [img=coin] [color=#FFD700]金币[/color] [img=coin]，\n"+
                       "不同路线上收集到的金币数量不同。\n\n" +

                       " 不同路线所需要付出的 [img=button] [color=#e45404]努力程度[/color] [img=button]不同。\n\n"+
                       
                       "在选择好路线后，你需要尽最大努力\n"+
                       "[b]快速点击加油按钮[/b] 来为神奇雨伞充电，\n"+
                       "并在规定时间内达到所需要的努力程度。\n"
                       );
            pageNo = 2;
            this.instructionsPanel = new InstructionsPanel(this, 
                                                           gameWidth/2, gameHeight/2,
                                                           pageNo, titleText, mainTxt, buttonTxt);
            }, this);
        
        ///////////////////PAGE THREE////////////////////
        eventsCenter.once('page2complete', function () {
            mainTxt = ("  选择哪条路线 [b]完全由你自己决定[/b]。\n\n"+ 

                       "  只有在规定时间内达到该路线所需要的努  \n" +
                       "  力程度，你才能够成功收集到金币。[b]努力  \n"+
                       "  程度越高[/b] 意味着你需要 [b]越快地点击按钮。[/b] \n\n" +
                       
                       "在正式游戏开始前，你将会学习如\n" +
                       "何通过点击按钮为神奇雨伞充电。\n\n" + 

                       "准备好了吗？请点击 [b]开始练习[/b] 按钮。\n");
            buttonTxt = "开始练习"
            pageNo = 3;
            this.instructionsPanel = new InstructionsPanel(this, 
                                                           gameWidth/2, gameHeight/2,
                                                           pageNo, titleText, mainTxt, buttonTxt);
            }, this);
        
        // end scene
        eventsCenter.once('page3complete', function () {
            this.nextScene();
            }, this);

    }
        
    update(time, delta) {
    }
    
    
    nextScene() {
        saveStartData(startTime);           // [for firebase]
        this.scene.start('PracticeTask');
    } 
}
