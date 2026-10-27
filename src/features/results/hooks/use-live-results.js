import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'
import { getVoteCounts } from '../api/get-vote-counts.js'

const EMPTY = { questionId: null, counts: {}, totalVoters: 0 }

export const useLiveResults = (questionId, phase) => {
  const [data, setData] = useState(EMPTY)

  useEffect(() => {
    if (!questionId) return
    let cancelled = false

    const refetch = () =>
      getVoteCounts(questionId)
        .then((result) => {
          if (!cancelled) setData({ questionId, ...result })
        })
        .catch((err) => console.error('Failed to load vote counts', err))

    const channel = supabase
      .channel(`votes-${questionId}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes', filter: `question_id=eq.${questionId}` },
        (payload) => {
          const optionId = payload.new.option_id
          setData((prev) =>
            prev.questionId === questionId
              ? { ...prev, counts: { ...prev.counts, [optionId]: (prev.counts[optionId] || 0) + 1 } }
              : prev
          )
        }
      )
      .subscribe()

    refetch()
    const interval = setInterval(refetch, 5000)

    return () => {
      cancelled = true
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [questionId, phase])

  const current = questionId && data.questionId === questionId ? data : EMPTY
  return { counts: current.counts, totalVoters: current.totalVoters }
}
