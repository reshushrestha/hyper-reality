import { useEffect, useState } from 'react'
import { getMyVote } from '../api/get-my-vote.js'
import { castVote as castVoteRequest } from '../api/cast-vote.js'

export const useCastVote = ({ questionId, voterId, onInvalidVoter }) => {
  //const [myVoteOptionId, setMyVoteOptionId] = useState(null)
  const key = questionId && voterId ? `${questionId}:${voterId}` : null
  const [vote, setVote] = useState({ key: null, optionId: null })
  const [problem, setProblem] = useState({ key: null, message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!key) return
    let cancelled = false
    getMyVote({ questionId, voterId })
      .then((optionId) => {
        if (!cancelled && optionId) setVote({ key, optionId })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [key, questionId, voterId])

  const myVoteOptionId = vote.key === key ? vote.optionId : null
  const error = problem.key === key ? problem.message : ''

  const castVote = async (optionId) => {
    if (!key || submitting || myVoteOptionId) return
    setSubmitting(true)
    setProblem({ key, message: '' })
    setVote({ key, optionId }) // optimistic

    try {
      const result = await castVoteRequest({ questionId, optionId, voterId })
      if (result === 'closed') {
        setVote({ key, optionId: null })
        setProblem({ key, message: 'Voting has just closed.' })
      } else if (result === 'invalid') {
        setVote({ key, optionId: null })
        onInvalidVoter?.()
      } else if (result === 'already_voted') {
        setVote({ key, optionId: await getMyVote({ questionId, voterId }) })
      }
    } catch {
      setVote({ key, optionId: null })
      setProblem({ key, message: "Couldn't send your vote. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return { myVoteOptionId, submitting, error, castVote }
}
