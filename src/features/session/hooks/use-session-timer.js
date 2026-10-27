import { useEffect, useState } from 'react'
import { useServerOffset } from './use-server-offset.js'
import { finishVoting } from '../api/finish-voting.js'

// Countdown for the current question, shared by admin / display / voter phones.
//  - phase "question": timer not started yet, shows the full duration
//  - phase "voting":   counts down to timer_ends_at using the SERVER clock
//  - autoFinish:       when it hits zero, ask the database to close voting
//                      (display + admin do this; voter phones don't)
export const useSessionTimer = (state, { autoFinish = false } = {}) => {
  const offset = useServerOffset()
  const [now, setNow] = useState(() => Date.now())

  const phase = state?.phase
  const fullMs = (state?.timer_seconds || 0) * 1000
  const endsAtMs = phase === 'voting' && state?.timer_ends_at ? new Date(state.timer_ends_at).getTime() : null
  const running = endsAtMs !== null

  useEffect(() => {
    if (!running) return
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0) // refresh immediately; `now` may be stale
    const id = setInterval(tick, 200)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [running, endsAtMs])

  let remainingMs = 0
  if (phase === 'question') {
    remainingMs = fullMs
  } else if (running) {
    remainingMs = Math.min(fullMs, Math.max(0, endsAtMs - (now + offset)))
  }

  const expired = running && remainingMs <= 0

  useEffect(() => {
    if (!autoFinish || !expired) return
    const attempt = () => finishVoting().catch((err) => console.error(err))
    attempt()
    const id = setInterval(attempt, 800) // retry until the phase flips to "results"
    return () => clearInterval(id)
  }, [autoFinish, expired, endsAtMs])

  return { remainingMs, secondsLeft: Math.ceil(remainingMs / 1000), expired, running }
}
