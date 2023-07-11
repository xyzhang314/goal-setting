import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://gmvunxcjewopcxdjmlwt.supabase.co', 
                              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdnVueGNqZXdvcGN4ZGptbHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg3MzY4ODcsImV4cCI6MjAwNDMxMjg4N30.2qKUqgFXKKZZB6vEiqkjOomcpBZzJE7n4FBR0Ez7WJA')

const { uid, error } = await supabase.auth.admin.getUserById(1)