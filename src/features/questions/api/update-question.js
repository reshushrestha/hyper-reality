import { supabase } from '../../../lib/supabaseClient.js'

export const updateQuestion = async (questionId, patch) => {
  const { error } = await supabase.from('questions').update(patch).eq('id', questionId)
  if (error) throw error
}
