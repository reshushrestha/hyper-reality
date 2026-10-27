import { supabase } from '../../../lib/supabaseClient.js'

export const getVoteCounts = async (questionId) => {
  const [countsRes, votersRes] = await Promise.all([
    supabase.rpc('get_vote_counts', { p_question_id: questionId }),
    supabase.rpc('get_voter_count'),
  ])
  if (countsRes.error) throw countsRes.error

  const counts = {}
  for (const row of countsRes.data || []) {
    counts[row.option_id] = Number(row.vote_count)
  }
  return { counts, totalVoters: Number(votersRes.data || 0) }
}
