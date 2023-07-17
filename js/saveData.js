// Helper functions for saving trial data [using firebase's firetore]

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://gmvunxcjewopcxdjmlwt.supabase.co', 
                              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdnVueGNqZXdvcGN4ZGptbHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg3MzY4ODcsImV4cCI6MjAwNDMxMjg4N30.2qKUqgFXKKZZB6vEiqkjOomcpBZzJE7n4FBR0Ez7WJA')

// import task version info
import { randCond } from "./versionInfo.js";

// function to save startData 
var saveStartData = async function(startTime) {const { data, error } = await supabase
    .from('rew_eff')
    .upsert({
        date: new Date().toISOString().split('T')[0],
        start_time: new Date().toLocaleTimeString(),
        condition: randCond,
        exp_completed: 0,
        participant_os: navigator.userAgent,
        task_starttime_phaser: startTime
})};

// function to save the practice data
var savePracTaskData = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({practice_data: dataToSave})
    .eq('participant_os', navigator.userAgent)
};
//----------------------------------- TASK 0 -------------------------------------------
// function to save the task0 data
var saveTask0Data = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'task0_data': dataToSave})
    .eq('participant_os', navigator.userAgent)
};

// function to save the task0-post-block questions data
var saveTask0Ques = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'task0_block_ques': dataToSave})
    .eq('participant_os', navigator.userAgent)
};

// function to save the post-task0 PHQ data
var saveTask0PHQ = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'post_task0_phq': dataToSave})
    .eq('participant_os', navigator.userAgent)
};
//---------------------------------Intervention-----------------------------------------
// function to save Quiz answer
var saveQuizData = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'quiz_ans': dataToSave})
    .eq('participant_os', navigator.userAgent)
};

// function to save Goal OR GameLike score
var saveIntervention = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'goal_gamelike': dataToSave})
    .eq('participant_os', navigator.userAgent)
};
//----------------------------------- TASK 1 -------------------------------------------
// function to save the task1 data
var saveTask1Data = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'task1_data': dataToSave})
    .eq('participant_os', navigator.userAgent)
};

// function to save the task1-post-block questions data
var saveTask1Ques = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'task1_block_ques': dataToSave})
    .eq('participant_os', navigator.userAgent)
};

// function to save the post-task1 PHQ data
var saveTask1PHQ = async function(dataToSave){const { data, error } = await supabase
    .from('rew_eff')
    .update({'post_task1_phq': dataToSave})
    .eq('participant_os', navigator.userAgent)
};

//----------------------------------- END DATA -------------------------------------------
// function to save end data 
var saveEndData = async function(){const { data, error } = await supabase
    .from('rew_eff')
    .update({      
        exp_endtime: new Date().toLocaleTimeString(),
        exp_completed: 1})
    .eq('participant_os', navigator.userAgent)
   };

export { saveStartData, savePracTaskData, 
         saveQuizData, saveIntervention,
         saveTask0Data, saveTask0Ques, saveTask0PHQ,
         saveTask1Data, saveTask1Ques, saveTask1PHQ, saveEndData}