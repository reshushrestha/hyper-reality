import { useState } from 'react'
import { Alert, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { updateOption } from '../api/update-option.js'

// One answer: its video (saved on blur) and which question comes next (saved on change).
export const OptionRow = ({ option, otherQuestions, onChanged }) => {
  const [draftVideo, setDraftVideo] = useState(null) // only set while typing
  const [error, setError] = useState('')

  const save = async (patch) => {
    try {
      setError('')
      await updateOption(option.id, patch)
      await onChanged?.()
      setDraftVideo(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const saveVideo = () => {
    if (draftVideo === null) return
    const next = draftVideo.trim()
    if (next === (option.video_url || '')) return setDraftVideo(null)
    save({ video_url: next || null })
  }

  return (
    <Stack spacing={1} sx={{ py: 1.5 }}>
      <Typography sx={{ fontWeight: 600 }}>{option.option_text}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          label="Video URL if this option wins"
          value={draftVideo ?? option.video_url ?? ''}
          onChange={(e) => setDraftVideo(e.target.value)}
          onBlur={saveVideo}
          fullWidth
        />
        <TextField
          select
          size="small"
          label="Next Question to Ask"
          value={option.next_question_id || ''}
          onChange={(e) => save({ next_question_id: e.target.value || null })}
          slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
          sx={{ minWidth: { sm: 260 } }}
          fullWidth
        >
          <MenuItem value="">
            <em>Nothing. This is the last video</em>
          </MenuItem>
          {otherQuestions.map((q) => (
            <MenuItem key={q.id} value={q.id}>
              {q.question_text}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  )
}
