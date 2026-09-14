import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vbtibwejbwoyyyqgqevl.supabase.co'
const supabaseKey = 'sb_publishable_hynKGbUzwjjUNqfvSeBRAw_1gx0IJaK'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)