import { supabase } from '../../../lib/supabaseClient.js'

export const closeQuestion = async (questionId) => {
  await supabase
    .from('questions')
    .update({ status: 'closed', closed_at: new Date().toISOString() })
    .eq('id', questionId)
}
