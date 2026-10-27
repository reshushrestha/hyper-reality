import { useState } from 'react'
import { Alert, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import {
  startSession,
  sendQuestion,
  startTimer,
  nextVideo,
  endSession,
} from '../api/admin-actions.js'

const PHASE_LABELS = {
  not_started: 'Not started',
  idle: 'Session started',
  question: 'Question live',
  voting: 'Voting open',
  results: 'Results shown',
  video: 'Video playing',
  ended: 'Session ended',
}

// The admin lane of the flow chart: at every step, exactly one button.
export const SessionControl = ({ state, timer, nextQuestionText, onChanged }) => {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!state) return null
  const { phase } = state

  const run = async (action) => {
    setBusy(true)
    setError('')
    try {
      await action()
      await onChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const upNext = nextQuestionText ? `Next question: “${nextQuestionText}”` : ''

  let primary = null
  let hint = ''
  switch (phase) {
    case 'not_started':
    case 'ended':
      primary = { label: phase === 'ended' ? 'Start a new session' : 'Start session', action: startSession }
      hint = 'Plays the intro video on the display and gets the first question ready.'
      break
    case 'idle':
      primary = { label: 'Send first question live', action: sendQuestion }
      hint = upNext
      break
    case 'question':
      primary = { label: `Start timer (${state.timer_seconds}s)`, action: startTimer }
      hint = 'Voters can already see the question. The countdown starts on every screen when you press this.'
      break
    case 'voting':
      primary = { label: `Voting… ${timer.secondsLeft}s`, disabled: true }
      hint = 'Results appear automatically when the timer ends.'
      break
    case 'results':
      primary = { label: 'Next video', action: nextVideo }
      hint = 'Plays the video of the winning option on the display.'
      break
    case 'video':
      if (state.current_video_is_last) {
        primary = { label: 'End session', action: endSession, color: 'error' }
        hint = 'This is the last video.'
      } else {
        primary = { label: 'Send next question live', action: sendQuestion }
        hint = upNext
      }
      break
    default:
  }

  const canEndEarly = !['not_started', 'ended'].includes(phase) && !(phase === 'video' && state.current_video_is_last)

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600 }}>
            Session
          </Typography>
          <Chip
            size="small"
            label={PHASE_LABELS[phase]}
            color={phase === 'voting' ? 'warning' : phase === 'ended' || phase === 'not_started' ? 'default' : 'primary'}
          />
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {primary && (
          <Button
            variant="contained"
            size="large"
            color={primary.color || 'primary'}
            disabled={busy || primary.disabled}
            onClick={() => run(primary.action)}
            sx={{ py: 1.75, fontSize: '1.05rem' }}
          >
            {primary.label}
          </Button>
        )}

        {hint && (
          <Typography variant="body2" color="textSecondary">
            {hint}
          </Typography>
        )}

        {canEndEarly && (
          <Button
            size="small"
            color="inherit"
            disabled={busy}
            sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
            onClick={() => window.confirm('End the session now?') && run(endSession)}
          >
            End session early
          </Button>
        )}
      </Stack>
    </Paper>
  )
}
