import { supabase } from '../../../lib/supabaseClient.js'

// Returns { id, question_text, options: [{ id, option_text }] } or null.
export const getCurrentQuestion = async () => {
  const { data, error } = await supabase.rpc('get_current_question')
  if (error) throw error
  return data
}
