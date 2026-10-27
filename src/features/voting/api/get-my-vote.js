import { supabase } from '../../../lib/supabaseClient.js'

export const getMyVote = async ({ questionId, voterId }) => {
  const { data, error } = await supabase.rpc('get_my_vote', {
    p_question_id: questionId,
    p_voter_id: voterId,
  })
  if (error) throw error
  return data ?? null
}
