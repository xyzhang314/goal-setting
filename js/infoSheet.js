import { saveSubInfo} from "./saveData.js";
import { runTask } from "./task.js";
const { Query, User } = AV;
AV.init({
          appId: "7yk2g0IxApJ23zLC6w8hW2ml-gzGzoHsz",
          appKey: "O3GGJQvRi1vLugRNUMCN0JR0",
          serverURL: "https://7yk2g0ix.lc-cn-n1-shared.com",
        });

setFontSize();
window.onresize = setFontSize; //实时监听
function setFontSize(){
    var width = document.body.offsetWidth;
    var newSize = width/375*20;  
    var setHtml=document.getElementsByTagName('html')[0]; //通过根元素设置
    setHtml.style.fontSize = newSize+"px";
}

const subInfoPage1="<div role=\"main\" class=\"form-all\" box-shadow=0 0 32px rgba(42, 42, 42, 0.16)>"+
"<ul class=\"form-section page-section\">"+
    "<div id=\"logo\" class=\"form-input-wide\" data-layout=\"full\"> "+
    "   <img src=\"./assets/BNUlogo.png\" alt=\"BNU logo\" loading=\"lazy\" class=\"form-image\" style=\"border:0\" tabindex=\"0\" data-component=\"image\"> "+
    "<\/div>"+

    "<div class=\"form-header-group  header-large\">"+
    "	  <div class=\"header-text httac htvam\">"+
    "		   <h1 id=\"header_1\" class=\"form-header\" data-component=\"header\">小游戏-神奇雨伞<\/h1>"+
    "	  <\/div>"+
    "<\/div>"+
    
    "<div id=\"text_2\" class=\"form-html\" data-component=\"text\" tabindex=\"0\">"+
    "    <div style=\"font-family:Inter, sans-serif;color:#2c3345;\">"+
    "    <p class=\"MsoNormal\" style=\"font-family:Inter, sans-serif;\"><strong><span style=\"line-height:107%;\">项目说明<\/strong><\/p>"+
    "    <p class=\"MsoNormal\" style=\"font-family:Inter, sans-serif;\">首先，非常感谢您参与此次小测验！该项目由北京师范大学认知神经科学与学习国家重点实验室开展，目的是为了探究认知行为疗法中的行为疗法对精神类疾病的治疗机制。本项目采集的所有个人信息将会严格保密，仅用于科学研究，请您根据自己的情况如实填写并认真完成。非常感谢您的配合！<\/p>"+
    "    <p class=\"MsoNormal\" style=\"font-family:Inter, sans-serif;\"><strong>项目流程<\/strong><\/p>"+
    "    <p class=\"MsoNormal\" style=\"font-family:Inter, sans-serif;\">本项目主体部分为网页小游戏，大约需要20-30分钟完成，具体分为以下流程：<\/p>"+    
    "    <p class=\"MsoNormal\" style=\"font-family:Inter, sans-serif;\">1. 填写个人信息表格；<\/p>"+
    "    <p class=\"MsoNormal\" style=\"font-family:Inter, sans-serif;\">2. 完成前后两次小游戏测验。<\/p>"+
    "    <p class=\"MsoNormal\" style=\"font-family:Inter, sans-serif;\"><strong>个人信息填写<\/strong><\/p>"+
    "<form id=\"Info1\">"+
    "   <fieldset>"+
    "     <p style=\"margin-left:0.3rem; margin-bottom: 0.1rem;\">请输入您的姓名：<\/p>"+
    "     <input style=\"margin-left:0.3rem;\" type=\"text\" id=\"uname\" required\/>"+
    "     <p style=\"margin-left:0.3rem; margin-bottom: 0.1rem;\">请输入您的手机号：<\/p>"+
    "     <input style=\"margin-left:0.3rem;\" type=\"tel\" pattern=\"[0-9]{3}[0-9]{4}[0-9]{4}\" id=\"uphone\" required\/>"+
    // "  <span class=\"validity\"><\/span>"+
    "     <hr width=\"300\" \/>"+
    "     <p style=\"margin-left:0.3rem; margin-bottom: 0.2rem;\">您是否曾经或目前患有精神类疾病？<\/p>"+
    "     <input type=\"radio\" id=\"patient\" name=\"mentalIllness\" class=\"illed\" value=\"yes\" required\/>"+
    "     <label for=\"patient\">是<\/label><br \/>"+
    "     <input type=\"radio\" id=\"hc\" name=\"mentalIllness\" value=\"no\" required\/>"+
    "     <label for=\"hc\">否<\/label><br \/>"+
    "     <hr width=\"300\" \/>"+
    "<\/form>"+
    "<form class=\"expandable\">"+
    "      <p style=\"margin-left:0.3rem; margin-bottom: 0.2rem;\">您服用抗精神类药物多久了（未服用过请填无）？<\/p>"+
    "      <input style=\"margin-left:0.3rem;\" type=\"text\" id=\"medDur\" required\/>"+
    "      <hr width=\"300\" \/>"+
    "      <p style=\"margin-left:0.3rem; margin-bottom: 0.2rem;\">您最近一次服用抗精神类药物种类和时间是（未服用请勿填写）？<\/p>"+
    "   <div>"+
    "      <fieldset id=\"medInfo\">"+
    "      <legend style=\"font-size:26px\">药品1<\/legend>"+
    "         <label id=\"med\">药品名称：<\/label>"+
    "      <select class=\"medType\">"+
    "        <optgroup label=\"常用药品\">"+
    "          <option value=\"碳酸锂片\">碳酸锂片<\/option>"+
    "          <option value=\"奥氮平\">奥氮平<\/option>"+
    "          <option value=\"盐酸舍曲林\">盐酸舍曲林<\/option>"+
    "          <option value=\"阿立哌唑\">阿立哌唑<\/option>"+
    "          <option value=\"劳拉西泮\">劳拉西泮<\/option>"+
    "          <option value=\"盐酸舍曲林\">盐酸舍曲林<\/option>"+
    "          <option value=\"草酸艾司西酞普兰\">草酸艾司西酞普兰<\/option>"+
    "          <option value=\"枸橼酸坦度螺酮胶囊\">枸橼酸坦度螺酮胶囊<\/option>"+
    "          <option value=\"右佐匹克隆片\">右佐匹克隆片<\/option>"+
    "          <option value=\"盐酸文拉法辛缓释胶囊/片\">盐酸文拉法辛缓释胶囊/片<\/option>"+
    "          <option value=\"阿戈美拉汀\">阿戈美拉汀<\/option>"+
    "          <option value=\"富马酸喹硫平片\">富马酸喹硫平片<\/option>"+
    "          <option value=\"利培酮片\">利培酮片<\/option>"+
    "          <option value=\"丙戊酸钠片/丙戊酸镁片\">丙戊酸钠片/丙戊酸镁片<\/option>"+
    "        <\/optgroup>"+
    "        <optgroup label=\"其他药品\">"+
    "          <option value=\"帕利哌酮缓释片\">帕利哌酮缓释片<\/option>"+
    "          <option value=\"氯氮平片\">氯氮平片<\/option>"+
    "          <option value=\"奥沙西泮片\">奥沙西泮片<\/option>"+
    "          <option value=\"氟哌啶醇片\">氟哌啶醇片<\/option>"+
    "          <option value=\"马来酸氟伏沙明片\">马来酸氟伏沙明片<\/option>"+
    "          <option value=\"米氮平片\">米氮平片<\/option>"+
    "          <option value=\"艾司唑仑片\">艾司唑仑片<\/option>"+
    "          <option id=\"other\" value=\"其他\">其他（以上药品均不是）<\/option>"+
    "        <\/optgroup>"+
    "      <\/select><br \/>"+
    "         <input margin-left:0rem; type=\"text\" class=\"otherMed\" placeholder=\"其他药物（以上药品均不是）\"\/><br \/>"+
    "         <label id=\"med\">服用剂量（mg）：<\/label>"+
    "         <input margin-left:0rem; type=\"text\" class=\"medDose\"\/><br \/>"+
    "         <label id=\"med\" for=\"lastMedTime\">服药时间：<\/label>"+
    "         <input type=\"datetime-local\" class=\"MedTime\" name=\"MedTime\"\/>"+
    "         <hr width=\"300\" \/>"+
    "         <button id=\"add\" type=\"button\">+<\/button>"+
    "      <\/fieldset>"+
    "   <\/div>"+
    "      <div id=\"medField\"><\/div>"+
    "      <hr width=\"300\" \/>"+
    "<\/form>"+
    "   <center><button type=\"submit\">确认<\/button><\/center>"+
    "   <\/fieldset>"+
    "<\/div>"+
    "<\/div>"+
"<\/ul>"+
"<\/div>";

document.getElementById('infoSheet').innerHTML = subInfoPage1;

const medAdd = "<fieldset id=\"medInfo\">"+
"   <legend id=\"med1\" style=\"font-size:26px\">药品<\/legend>"+
"      <label id=\"med\">药品名称：<\/label>"+
"      <select class=\"medType\">"+
"        <optgroup label=\"常用药品\">"+
"          <option value=\"碳酸锂片\">碳酸锂片<\/option>"+
"          <option value=\"奥氮平\">奥氮平<\/option>"+
"          <option value=\"盐酸舍曲林\">盐酸舍曲林<\/option>"+
"          <option value=\"阿立哌唑\">阿立哌唑<\/option>"+
"          <option value=\"劳拉西泮\">劳拉西泮<\/option>"+
"          <option value=\"盐酸舍曲林\">盐酸舍曲林<\/option>"+
"          <option value=\"草酸艾司西酞普兰\">草酸艾司西酞普兰<\/option>"+
"          <option value=\"枸橼酸坦度螺酮胶囊\">枸橼酸坦度螺酮胶囊<\/option>"+
"          <option value=\"右佐匹克隆片\">右佐匹克隆片<\/option>"+
"          <option value=\"盐酸文拉法辛缓释胶囊/片\">盐酸文拉法辛缓释胶囊/片<\/option>"+
"          <option value=\"阿戈美拉汀\">阿戈美拉汀<\/option>"+
"          <option value=\"富马酸喹硫平片\">富马酸喹硫平片<\/option>"+
"          <option value=\"利培酮片\">利培酮片<\/option>"+
"          <option value=\"丙戊酸钠片/丙戊酸镁片\">丙戊酸钠片/丙戊酸镁片<\/option>"+
"        <\/optgroup>"+
"        <optgroup label=\"其他药品\">"+
"          <option value=\"帕利哌酮缓释片\">帕利哌酮缓释片<\/option>"+
"          <option value=\"氯氮平片\">氯氮平片<\/option>"+
"          <option value=\"奥沙西泮片\">奥沙西泮片<\/option>"+
"          <option value=\"氟哌啶醇片\">氟哌啶醇片<\/option>"+
"          <option value=\"马来酸氟伏沙明片\">马来酸氟伏沙明片<\/option>"+
"          <option value=\"米氮平片\">米氮平片<\/option>"+
"          <option value=\"艾司唑仑片\">艾司唑仑片<\/option>"+
"          <option id=\"other\" value=\"其他\">其他（以上药品均不是）<\/option>"+
"        <\/optgroup>"+
"      <\/select><br \/>"+
"      <input margin-left:0rem; type=\"text\" class=\"otherMed\" placeholder=\"其他药物（以上药品均不是）\"\/><br \/>"+
"      <label id=\"med\" >服用剂量（mg）：<\/label>"+
"      <input margin-left:0rem; type=\"text\" class=\"medDose\"\/><br \/>"+
"      <label id=\"med\" for=\"lastMedTime\">服药时间：<\/label>"+
"      <input type=\"datetime-local\" class=\"MedTime\" name=\"MedTime\"\/>"+
"      <hr width=\"300\" \/>"+
"   <\/fieldset>";

// 添加药品
var add = document.getElementById("add");
var n = 1;

add.addEventListener("click", function AddMed () {
  n+=1;
  if (n==2){
    var div = document.createElement('div');
    div.innerHTML = medAdd;
    var field = document.getElementById("medField");
    field.before(div);
    var medNum = document.getElementById("med1");
    medNum.textContent = "药品"+n;
    medNum.id = "med"+n;
  }else{
    var div = document.createElement('div');
    div.innerHTML = medAdd;
    var field = document.getElementById("medField");
    field.before(div);
    var medNum = document.getElementById("med1");
    medNum.textContent = "药品"+n; 
    medNum.id = "med"+n;
  }
})

// 我们需要获取表单元素
var form = document.getElementById("Info1");
var dbClass = "rew_eff0";
// ...然后接管表单的提交事件
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const phoneNum = Number(document.getElementById("uphone").value);
  window.phoneNum = phoneNum; //change to globally-scoped variables
  if ($("input[name='mentalIllness']:checked").val()=="no"){
        saveSubInfo('run', $("input[name='playTime']:checked").val());
        saveSubInfo('medicine', $("input[name='mentalIllness']:checked").val());
        document.getElementById('infoSheet').style.display = "none";
        runTask();
  }else{
        var type = document.getElementsByClassName("medType");
        var dose = document.getElementsByClassName("medDose");
        var time = document.querySelectorAll("input[name='MedTime']");
        var other = document.getElementsByClassName("otherMed");
        var i;
        for (i=0; i<type.length; i++){
        saveSubInfo('medType', type[i].value);
        saveSubInfo('medDose', dose[i].value);
        saveSubInfo('medTime', time[i].value);
        saveSubInfo('otherMed', other[i].value);
        }
        saveSubInfo('run',$("input[name='playTime']:checked").val());
        saveSubInfo('medDur', document.getElementById("medDur").value);
        document.getElementById('infoSheet').style.display = "none";
        runTask();
        }
 }
);
