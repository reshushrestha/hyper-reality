import { useState } from 'react'
import { Alert, Button, Chip, Divider, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { OptionRow } from './option-row.jsx'
import { setFirstQuestion } from '../api/set-first-question.js'
import { deleteQuestion } from '../api/delete-question.js'
import { updateQuestion } from '../api/update-question.js'

export const QuestionCard = ({ question, allQuestions, onChanged }) => {
  const [error, setError] = useState('')
  const [draftTimer, setDraftTimer] = useState(null) // only set while typing

  const run = async (action) => {
    try {
      setError('')
      await action()
      await onChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  const saveTimer = async () => {
    if (draftTimer === null) return
    const seconds = Number(draftTimer)
    if (seconds === question.timer_seconds) return setDraftTimer(null)
    if (!Number.isInteger(seconds) || seconds < 5 || seconds > 600) {
      setError('Timer must be a whole number between 5 and 600 seconds.')
      return setDraftTimer(null)
    }
    await run(() => updateQuestion(question.id, { timer_seconds: seconds }))
    setDraftTimer(null)
  }

  const otherQuestions = allQuestions.filter((q) => q.id !== question.id)

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: question.is_first ? 'primary.main' : 'divider' }}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Stack spacing={1}>
            <Typography variant="h6" component="h3" sx={{ lineHeight: 1.3 }}>
              {question.question_text}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {question.is_first && <Chip size="small" color="primary" label="First question" />}
              <TextField
                size="small"
                type="number"
                label="Timer (s)"
                value={draftTimer ?? String(question.timer_seconds)}
                onChange={(e) => setDraftTimer(e.target.value)}
                onBlur={saveTimer}
                sx={{ width: 110 }}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            {!question.is_first && (
              <Button size="small" variant="outlined" onClick={() => run(() => setFirstQuestion(question.id))}>
                Set as first
              </Button>
            )}
            <Tooltip title="Delete question">
              <IconButton
                aria-label="Delete question"
                onClick={() => window.confirm('Delete this question and its options?') && run(() => deleteQuestion(question.id))}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Divider />

        {question.options.map((option, index) => (
          <Stack key={option.id}>
            {index > 0 && <Divider />}
            <OptionRow option={option} otherQuestions={otherQuestions} onChanged={onChanged} />
          </Stack>
        ))}
      </Stack>
    </Paper>
  )
}
