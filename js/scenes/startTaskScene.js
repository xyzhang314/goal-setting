// Scene to inform participants they can now start the main task, routes to Main Task scene

// import task info from versionInfo file
import { approxTimeTask, nBlocks } from "../versionInfo.js";  // time participant will have to try and exert effort (ms)

// this function extends Phaser.Scene and includes the core logic for the scene
export default class StartTaskScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartTaskScene'
        });
    }

    preload() {
        // load cloud sprites to add texture to background
        this.load.image('cloud1', './assets/imgs/cloud1.png');
    }
    
    create() {
        // load a few cloud sprites dotted around
        const cloud1 = this.add.sprite(180, 100, 'cloud1');
        const cloud2 = this.add.sprite(320, 540, 'cloud1');
        const cloud3 = this.add.sprite(630,  80, 'cloud1');
        
        // add popup dialogue box with text
        var SoT = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x1ea7e1),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
                text: this.add.text(0, 0, " 练习结束！", {
                    fontSize: '24px',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                    }),
                align: 'center',
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            content: this.rexUI.add.BBCodeText(0, 0, 
                   ("接下来是正式游戏部分。\n\n" +

                    "想要成功收集金币，你需要[color=#d0f4f7]尽最大努力\n"+
                    "快速点击加油按钮[/color]，为神奇雨伞充电，\n"+
                    " 并且在规定时间内达到路线所需的努力程度。\n"+
                    " 收集[color=#d0f4f7]更多金币[/color]的路线需要付出[color=#d0f4f7]更多努力[/color]。\n\n"+
                    
                    "该部分游戏包括 [color=#d0f4f7]"+nBlocks+" 个小节[/color]，大约需要\n"+
                    "[color=#d0f4f7]"+approxTimeTask+" 分钟[/color]，每个小节之间可以自行休息。\n\n"+

                    "准备好了吗？请 [b]点击下方按钮[/b] 开始游戏。\n"),
                   {fontSize: '21px',
                    font: '26px monospace',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                    align: 'center',
                    color: '#000000'
                   }),
            actions: [
                createLabel(this, '开始游戏')
            ],
            space: {
                title: 25,
                content: 10,
                action: 10,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            align: {
                actions: 'center',
            },
            expand: {
                content: false, 
            }
            });
        
        // control panel position and layout
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        SoT
        .setPosition(gameWidth/2, gameHeight/2)
        .layout()
        .popUp(500);
        
        // control action button functionality (click, hover)
        SoT
        .once('button.click', function (button) {
            SoT.scaleDownDestroy(500);
            this.nextScene();                           
        }, this)
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(2, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        });

        // !!while we're here...
        //this.registry.set('taskN', 0);    // initialize taskN (as a registry var so can pass between screens)
    }
    
    update(time, delta) {
    }
    
    nextScene() {
        this.scene.start('MainTask');
    } 
}

// generic function to create button labels
var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0x5e81a2),
        text: scene.add.text(0, 0, text, {
            fontSize: '21px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            //fill: '#000000'
        }),
        align: 'center',
        width: 40,
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
};