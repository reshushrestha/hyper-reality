import { supabase } from '../../../lib/supabaseClient.js'

export const getActiveQuestion = async () => {
  const { data: question } = await supabase
    .from('questions')
    .select('id, question_text, status')
    .eq('status', 'active')
    .maybeSingle()

  if (!question) return { question: null, options: [] }

  const { data: options } = await supabase
    .from('options')
    .select('id, option_text, display_order')
    .eq('question_id', question.id)
    .order('display_order')

  return { question, options: options || [] }
}
