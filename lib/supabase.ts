import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pknxrdodtjswwkzhyxzp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nV0mEzBQxKiFCwkF05x32w_BnS7JuZs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

