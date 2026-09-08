import { supabase } from '../../../lib/supabaseClient.js'

export const getQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, status, display_order, options(id)')
    .order('display_order')

  if (error) throw error
  return data || []
}
