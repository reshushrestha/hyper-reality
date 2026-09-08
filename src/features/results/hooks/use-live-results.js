import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'
import { getVoteCounts } from '../api/get-vote-counts.js'

export const useLiveResults = (questionId) => {
  const [counts, setCounts] = useState({})
  const [totalVoters, setTotalVoters] = useState(0)

  const refetch = useCallback(async () => {
    if (!questionId) {
      setCounts({})
      return
    }
    const { counts, totalVoters } = await getVoteCounts(questionId)
    setCounts(counts)
    setTotalVoters(totalVoters)
  }, [questionId])

  useEffect(() => {
    refetch()

    if (!questionId) return

    const channel = supabase
      .channel(`live-results-${questionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes', filter: `question_id=eq.${questionId}` },
        refetch
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [questionId, refetch])

  return { counts, totalVoters }
}
