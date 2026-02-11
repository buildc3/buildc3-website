import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgbksjkefolzcxzxkzgz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYmtzamtlZm9semN4enhremd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjA1MjAsImV4cCI6MjA4NjM5NjUyMH0.IVIIDnmkvvn1TOZSOkhLv2glFGtmYz7jky3qHLMSK-E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
