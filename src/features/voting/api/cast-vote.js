import { supabase } from '../../../lib/supabaseClient.js'

export const castVote = async ({ questionId, optionId, voterId }) => {
  const { data, error } = await supabase.rpc('cast_vote', {
    p_question_id: questionId,
    p_option_id: optionId,
    p_voter_id: voterId,
  })
  if (error) throw error
  return data
}
