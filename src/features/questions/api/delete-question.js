import { supabase } from '../../../lib/supabaseClient.js'

export const deleteQuestion = async (questionId) => {
  const { error } = await supabase.from('questions').delete().eq('id', questionId)
  if (error) throw error
}
