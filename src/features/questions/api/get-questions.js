import { supabase } from '../../../lib/supabaseClient.js'

export const getQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, timer_seconds, is_first, display_order, options!question_id(id, option_text, display_order, video_url, next_question_id)')
    .order('display_order')

  if (error) throw error
  return (data || []).map((q) => ({
    ...q,
    options: [...(q.options || [])].sort((a, b) => a.display_order - b.display_order),
  }))
}
