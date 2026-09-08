import { supabase } from '../../../lib/supabaseClient.js'

export const getVoteCounts = async (questionId) => {
  const [{ data: votes }, { count: totalVoters }] = await Promise.all([
    supabase.from('votes').select('option_id').eq('question_id', questionId),
    supabase.from('voters').select('id', { count: 'exact', head: true }),
  ])

  const counts = {}
  for (const vote of votes || []) {
    counts[vote.option_id] = (counts[vote.option_id] || 0) + 1
  }

  return { counts, totalVoters: totalVoters || 0 }
}
