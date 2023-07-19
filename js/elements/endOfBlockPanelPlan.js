// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

// make popup dialog box to tell participants they can take a break between blocks
export default class EndOfBlockPanelPlan {
    constructor(scene, x, y, nCoins, blockGoal) {
    this.scene = scene;
        
    var titleTxtB = ' 本轮游戏结束！'; 
    var mainTxtB = ('你已经完成本轮游戏，在这轮\n'+
                    ' 游戏中，你收集了 [color=#FFD700]'+nCoins+' 金币[/color]。\n\n'+
                    ' 你设定的目标为 [color=#FFD700]'+blockGoal+' 金币[/color]。\n\n'+
                    '现在，你可以休息一会。\n\n'+
                    '当你准备好了开始下一轮游\n'+
                    '戏，请点击下方 [b]继续[/b] 按钮。');
    var buttonTxtB = '继续';     
        
    var askBreakPanel = createBreakPanel(scene, titleTxtB, mainTxtB, buttonTxtB)
        .setPosition(x, y)
        .layout()
        //.drawBounds(scene.add.graphics(), 0xff0000) // for debugging only
        .once('button.click', function (button) {
            askBreakPanel.scaleDownDestroy();       // destroy panel
            eventsCenter.emit('breakover');         // emit completion event
        }, this)
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(2, 0xffffff); // when hover
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        });
    }
}

///////////popup dialog box//////
var createBreakPanel = function (scene, titleTxtB, mainTxtB, buttonTxtB) {
    var textboxB = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x1ea7e1),
    
    title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
        text: scene.add.text(0, 0, titleTxtB, {
            fontSize: '24px',
            // fontFamily: "Microsoft Yahei",
            }),
        align: 'center',
        space: {
            left: 15,
            right: 15,
            top: 10,
            bottom: 10
        }
    }),

    content: scene.rexUI.add.BBCodeText(0, 0, mainTxtB, 
                                        {fontSize: '20px', align: 'center', color: '#000000'}),

    actions: [
        createLabelB(scene, buttonTxtB)
    ],

    space: {
        title: 20,
        content: 20,
        action: 20,
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
    },
        
    align: {
        actions: 'center',
    },

    expand: {
        content: false, 
    }
    })
    .layout();
    
    return textboxB;
};

/////////button labels////////////////////////////
var createLabelB = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0x5e81a2),
        text: scene.add.text(0, 0, text, {
            fontSize: '21px',
            font: "26px monospace"
            //fontFamily: "Microsoft Yahei",
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