import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient' 

/**
 * Use on the admin, user and screen pages.
 * Every page reads the same deadline (questions.timer_ends_at) and counts down to it.
 *
 * running  - timer started and time remains (enable voting while true)
 * finished - timer started and time has run out (question still active)
 */
export function useQuestionTimer(questionId, enabled = true) {
  const [row, setRow] = useState(null)
  const [offset, setOffset] = useState(0) // server time minus device time, in ms
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!enabled || !questionId) return

    let cancelled = false
    let channel

    const syncClock = async () => {
      const t0 = Date.now()
      const { data } = await supabase.rpc('server_now')
      const t1 = Date.now()
      if (data && !cancelled) {
        setOffset(new Date(data).getTime() - (t0 + t1) / 2)
      }
    }

    const load = async () => {
      const { data } = await supabase
        .from('questions')
        .select('id, status, timer_ends_at')
        .eq('id', questionId)
        .single()
      if (data && !cancelled) setRow(data)
    }

    syncClock()
    load()

    channel = supabase
      .channel(`question-timer-${questionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'questions',
          filter: `id=eq.${questionId}`,
        },
        (payload) => setRow(payload.new)
      )
      .subscribe((status) => {
        // after a dropped connection, catch up on anything missed
        if (status === 'SUBSCRIBED') load()
      })

    // phones pause background tabs; resync when the page returns
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        syncClock()
        load()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [questionId, enabled])

  const endsAt =
    enabled && row?.status === 'active' && row.timer_ends_at
      ? new Date(row.timer_ends_at).getTime()
      : null

  // The local tick only redraws the screen; the deadline is what everyone agrees on.
  useEffect(() => {
    if (!endsAt) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [endsAt])

  const msLeft = endsAt ? Math.max(0, endsAt - (now + offset)) : 0

  return {
    secondsLeft: Math.ceil(msLeft / 1000),
    running: !!endsAt && msLeft > 0,
    finished: !!endsAt && msLeft === 0,
  }
}
