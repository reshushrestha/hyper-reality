import { useState } from 'react'
import { Alert, Stack, TextField } from '@mui/material'
import { setIntroVideo } from '../api/admin-actions.js'

// The "first video" from the flow chart: plays on the display when the session starts.
// `draft` is only set while the admin is typing; otherwise the saved value is shown.
export const IntroVideoField = ({ value, onSaved }) => {
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState('')

  const save = async () => {
    if (draft === null) return
    const next = draft.trim()
    try {
      setError('')
      if (next !== (value || '')) {
        await setIntroVideo(next)
        await onSaved?.()
      }
      setDraft(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Stack spacing={1}>
      <TextField
        label="First video URL (plays when the session starts)"
        placeholder="https://pub-xxxx.r2.dev/intro.mp4"
        value={draft ?? value ?? ''}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        fullWidth
      />
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  )
}
