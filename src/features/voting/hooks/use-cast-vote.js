import { useEffect, useState } from 'react'
import { getMyVote } from '../api/get-my-vote.js'
import { castVote as castVoteRequest } from '../api/cast-vote.js'

export const useCastVote = ({ questionId, voterId }) => {
  const [myVoteOptionId, setMyVoteOptionId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!questionId || !voterId) {
      setMyVoteOptionId(null)
      return
    }
    getMyVote({ questionId, voterId }).then(setMyVoteOptionId)
  }, [questionId, voterId])

  const castVote = async (optionId) => {
    if (!questionId || submitting || myVoteOptionId) return
    setSubmitting(true)
    setMyVoteOptionId(optionId) // optimistic

    const { error } = await castVoteRequest({ questionId, optionId, voterId })

    if (error) {
      // most likely a vote was already cast from another tab/device
      const existing = await getMyVote({ questionId, voterId })
      setMyVoteOptionId(existing)
    }
    setSubmitting(false)
  }

  return { myVoteOptionId, submitting, castVote }
}
