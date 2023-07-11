// Helper functions for saving trial data [using firebase's firetore]

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://gmvunxcjewopcxdjmlwt.supabase.co', 
                              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdnVueGNqZXdvcGN4ZGptbHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg3MzY4ODcsImV4cCI6MjAwNDMxMjg4N30.2qKUqgFXKKZZB6vEiqkjOomcpBZzJE7n4FBR0Ez7WJA')

// import task version info
import { randCond } from "./versionInfo.js";

// function to save startData 
const { data, error } = await supabase
.from('rew_eff')
.upsert({
    date: new Date().toISOString().split('T')[0],
    start_time: new Date().toLocaleTimeString(),
    condition: randCond,
    exp_completed: 0,
    participant_os: navigator.userAgent,
    task_starttime_phaser: startTime,
   })

export { saveStartData }