import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'
import { getSessionState } from '../api/get-session-state.js'

// Never let an older copy of the row (e.g. a slow poll) replace a newer one.
const pickNewer = (prev, next) =>
  !prev || new Date(next.updated_at) >= new Date(prev.updated_at) ? next : prev

// Live copy of the single session_state row. Realtime does the heavy lifting;
// the interval + "tab became visible" refetch is a safety net for dropped connections.
export const useSessionState = () => {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)

  // For event handlers (e.g. right after an admin button press).
  const refetch = useCallback(async () => {
    try {
      const row = await getSessionState()
      setState((prev) => pickNewer(prev, row))
    } catch (err) {
      console.error('Failed to load session state', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = () =>
      getSessionState()
        .then((row) => {
          if (cancelled) return
          setState((prev) => pickNewer(prev, row))
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to load session state', err)
          if (!cancelled) setLoading(false)
        })

    load()

    const channel = supabase
      .channel(`session-state-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'session_state' },
        (payload) => (payload.new?.id ? setState((prev) => pickNewer(prev, payload.new)) : load())
      )
      .subscribe()

    const interval = setInterval(load, 10000)
    const onVisible = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [])

  return { state, loading, refetch }
}
