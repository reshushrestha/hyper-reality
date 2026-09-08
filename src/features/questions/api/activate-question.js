import { supabase } from '../../../lib/supabaseClient.js'

export const activateQuestion = async (questionId) => {
  await supabase
    .from('questions')
    .update({ status: 'closed', closed_at: new Date().toISOString() })
    .eq('status', 'active')

  await supabase
    .from('questions')
    .update({ status: 'active', activated_at: new Date().toISOString() })
    .eq('id', questionId)
}
