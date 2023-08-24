// Helper functions for saving trial data [using LeanCloud]

const { Query, User } = AV;
AV.init({
          appId: "7yk2g0IxApJ23zLC6w8hW2ml-gzGzoHsz",
          appKey: "O3GGJQvRi1vLugRNUMCN0JR0",
          serverURL: "https://7yk2g0ix.lc-cn-n1-shared.com",
        });

// import task version info
import { randCond } from "./versionInfo.js";
const Database = AV.Object.extend("goal_setting");
const database = new Database();

// function to save startData
var saveSubInfo = function(type, dataToSave){
        database.add("subInfo", {[type]:dataToSave});
        database.set("phoneNum", phoneNum);
        database.set("participantOS", navigator.userAgent);
        database.save();
}
var saveStartData = function(startTime) {
    const query = new AV.Query("Database");
    query.equalTo("participantOS", navigator.userAgent);
    query
    .find()
    .then(function (){
        database.set("date", new Date().toISOString().split('T')[0]);
        database.set("startTime", new Date().toLocaleTimeString());
        database.set("condition", randCond);
        database.set("expCompleted", 0);
        database.set("taskStartTimePhaser", startTime);
        database.save();
    })
};

// // function to save the practice data
var savePracTaskData = function(trialN, dataToSave){
        database.add("practiceData", {[trialN]: dataToSave});
        database.save();
}
//----------------------------------- TASK 0 -------------------------------------------
// function to save the task0 data
var saveTask0Data = function(trialN, dataToSave){
        database.add("task0Data", {[trialN]: dataToSave});
        database.save();
}
// function to save goal OR gameLiking score
var saveIntervData = function(trialN, dataToSave){
        database.add("goalORgame", {[trialN]: dataToSave});
        database.save();
}
// function to save the task1 data
var saveTask1Data = function(trialN, dataToSave){
        database.add("task1Data", {[trialN]: dataToSave});
        database.save();
}
// function to save post-block question data
var savePostTaskData = function(questN, dataToSave){
    database.add("postTaskData", {[questN]: dataToSave});
    database.save();
}
// function to save end data 
var saveEndData = function(){
        database.set("endTime", new Date().toLocaleTimeString());
        database.set("expCompleted", 1);
        database.save();
}

export { saveSubInfo, saveStartData, savePracTaskData, saveTask0Data, saveIntervData, saveTask1Data, savePostTaskData, saveEndData}