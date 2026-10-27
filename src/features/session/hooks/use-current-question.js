import { useEffect, useState } from 'react'
import { getCurrentQuestion } from '../api/get-current-question.js'

// Loads the live question + its options whenever the live question changes.
// The result is stored together with its id, so a stale question is never shown.
export const useCurrentQuestion = (questionId) => {
  const [loaded, setLoaded] = useState(null)

  useEffect(() => {
    if (!questionId) return
    let cancelled = false
    getCurrentQuestion()
      .then((q) => {
        if (!cancelled && q) setLoaded(q)
      })
      .catch((err) => console.error(err))
    return () => {
      cancelled = true
    }
  }, [questionId])

  return { question: questionId && loaded?.id === questionId ? loaded : null }
}
