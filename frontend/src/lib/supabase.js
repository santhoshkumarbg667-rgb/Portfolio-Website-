import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://raiuggbqvayxnkhnyqlu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhaXVnZ2JxdmF5eG5raG55cWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzA0MzgsImV4cCI6MjA4NjcwNjQzOH0.VerelXmJpO3jidJEGd2OaemzzgkbMdCX0p4SzNkaBTQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
