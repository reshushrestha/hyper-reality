import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'
import { getQuestions } from '../api/get-questions.js'

export const useQuestions = () => {
  const [state, setState] = useState({ questions: [], loading: true, error: '' })

  const refetch = useCallback(async () => {
    try {
      setState({ questions: await getQuestions(), loading: false, error: '' })
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err.message }))
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    getQuestions()
      .then((questions) => {
        if (!cancelled) setState({ questions, loading: false, error: '' })
      })
      .catch((err) => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: err.message }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { ...state, refetch }
}
