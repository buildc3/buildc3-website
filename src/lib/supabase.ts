import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yrtifzcgjfbfdhdoouov.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydGlmemNnamZiZmRoZG9vdW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjU4MTAsImV4cCI6MjA4NjQwMTgxMH0.c5pdlW6Idhsc53Z6vZbmpt38nA5sMA90KiFPQcPnpBc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
