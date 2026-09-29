import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'
import { getActiveQuestion } from '../api/get-active-question.js'

export const useActiveQuestion = () => {
  const [question, setQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const { question, options } = await getActiveQuestion()
    
    setQuestion(question)
    setOptions(options)
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()

    const channel = supabase
      .channel('active-question-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        refetch
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [refetch])

  return { question, options, loading, refetch }
}
