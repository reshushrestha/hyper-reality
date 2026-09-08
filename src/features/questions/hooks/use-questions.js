import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'
import { getQuestions } from '../api/get-questions.js'

export const useQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const data = await getQuestions()
    setQuestions(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()

    const channel = supabase
      .channel('admin-questions-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        refetch
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [refetch])

  return { questions, loading, refetch }
}
