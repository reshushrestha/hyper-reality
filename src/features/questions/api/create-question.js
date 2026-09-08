import { supabase } from '../../../lib/supabaseClient.js'

export const createQuestion = async ({ questionText, options, displayOrder }) => {
  const { data: question, error } = await supabase
    .from('questions')
    .insert({ question_text: questionText, display_order: displayOrder })
    .select('id')
    .single()

  if (error) throw error

  const { error: optionsError } = await supabase.from('options').insert(
    options.map((optionText, index) => ({
      question_id: question.id,
      option_text: optionText,
      display_order: index,
    }))
  )

  if (optionsError) throw optionsError

  return question
}
