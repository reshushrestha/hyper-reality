import { supabase } from '../../../lib/supabaseClient.js'

export const setFirstQuestion = async (questionId) => {
  const { error } = await supabase.rpc('admin_set_first_question', { p_id: questionId })
  if (error) throw new Error(error.message)
}
