// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

// control things to ask about
var controlItems = ['动作游戏','拼图游戏','冒险游戏','角色扮演游戏'];

// make popup dialog box with instructions and number bar for participant to enter ratings
export default class ControlPanel {
    constructor(scene, x, y, block, controlItem) {
    this.scene = scene;

    var controlItem = controlItems[block];

    var mainTxt =  '在本次游戏中，你需要在每轮游戏开始\n'+
                   '前，对不同类型的游戏进行喜爱度评分。\n\n'+

                   '你喜欢玩 [b]'+controlItem+'[/b] 吗？\n\n'+
                   '请拖动下方滑动条进行评分，其中\n'+
                   '      0 = “不喜欢”          100 = “非常喜欢”     \n\n'+

                   '当你准备好时，请点击 [b]确认[/b] 按钮开始游戏。\n';
    
    var buttonTxt = '确认';     

    var mainPanel = createMainPanel(scene, mainTxt, buttonTxt, block)
        .setPosition(x,y)
        .layout()
        //.drawBounds(scene.add.graphics(), 0xff0000) //for debugging only
        .popUp(500); 
    }
    
}

////////////////////functions for making in-scene graphics//////////////////////////
///////////main panel////////////
var createMainPanel = function (scene, mainTxt, buttonTxt, block) {
    // create global registry var to pass ratings data between scenes
    scene.registry.set('block'+block+'answer', []);
    // create panel components
    var dialog = createDialog(scene, mainTxt, buttonTxt);
    var slider = createNumberBar(scene);
    var mainPanel = scene.rexUI.add.fixWidthSizer({
        orientation: 'x' // vertical stacking
        }).add(
            dialog, // child
            0, // proportion
            'center', // align
            0, // paddingConfig
            false, // expand
        )
        .add(
            slider, // child
            0, // proportion
            'center', // align
            0, // paddingConfig
            true, // expand
        )
    .layout();
    
    slider
    .once('valuechange', function () {
        //only allow answer to be entered once ppt has interacted with slider
        dialog
            .once('button.click', function (button, groupName, index) {
                let answer = Math.round(slider.getValue(0, 100));   // get final slider value
                scene.registry.set('block'+block+'answer', answer);
                dialog.scaleDownDestroy();            // destroy ratings panel components
                slider.scaleDownDestroy();            // destroy ratings panel components
                eventsCenter.emit('block'+block+'answered');   // emit completion event
            }, this)
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(2, 0xffffff); // when hover
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
    });
    
    return mainPanel;
};

///////////popup dialog box//////
var createDialog = function (scene, mainTxt, buttonTxt) {
    var textbox = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x815532),
    
    title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xf57f17),
        text: scene.add.text(0, 0, '提问环节', {
            fontSize: '24px',
            fontFamily: "Microsoft Yahei",
            }),
        align: 'center',
        space: {
            left: 15,
            right: 15,
            top: 10,
            bottom: 10
        }
    }),

    content: scene.rexUI.add.BBCodeText(0, 0, mainTxt, {
        fontSize: '21px',
        font: '26px monospace',
        fontFamily: "Microsoft Yahei",
        align: 'center'
    }),

    actions: [
        createLabel(scene, buttonTxt)
    ],

    space: {
        title: 25,
        content: 20,
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
    })
    .layout();
    
    return textbox;
};

/////////button labels////////////////////////////
var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0xf57f17),
        text: scene.add.text(0, 0, text, {
            fontSize: '21px',
            fontFamily: "Microsoft Yahei",
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

////////number bar//////////////////////////////////
var createNumberBar = function (scene) {
    var numberBar = scene.rexUI.add.numberBar({ 
        width: 494,                 // fixed width slider
        orientation: 'horizontal',

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x815532),
        icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xf57f17),

        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x7b8185),
            indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xf57f17),
            input: 'click',
        },

        text: scene.rexUI.add.BBCodeText(0, 0, '', {
            fontSize: '20px', fixedWidth: 50, fixedHeight: 45,
            valign: 'center', halign: 'center', fontFamily: "Microsoft Yahei",
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10,
            slider: 10,
        },

        valuechangeCallback: function (value, oldValue, numberBar) {
            numberBar.text = Math.round(Phaser.Math.Linear(0, 100, value));
            return value;
        },
        
    })
    .setValue(0, 0, 100)
    .layout();
    
    return numberBar;
};