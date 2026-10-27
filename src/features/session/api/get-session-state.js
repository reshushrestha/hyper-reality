import { supabase } from '../../../lib/supabaseClient.js'

export const getSessionState = async () => {
  const { data, error } = await supabase
    .from('session_state')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) throw error
  return data
}
