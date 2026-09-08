import { supabase } from '../../../lib/supabaseClient.js'

export const getMyVote = async ({ questionId, voterId }) => {
  const { data } = await supabase
    .from('votes')
    .select('option_id')
    .eq('question_id', questionId)
    .eq('voter_id', voterId)
    .maybeSingle()

  return data?.option_id ?? null
}
