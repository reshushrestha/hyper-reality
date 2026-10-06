import { supabase } from '../../../lib/supabaseClient.js'

export const closeQuestion = async (questionId) => {
  return await supabase
    .from('questions')
    .update({ status: 'closed', timer_started: false, closed_at: new Date().toISOString() })
    .eq('id', questionId)
}
