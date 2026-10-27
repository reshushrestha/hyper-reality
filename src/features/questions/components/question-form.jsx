import { useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createQuestion } from '../api/create-question.js'

const emptyOption = () => ({ text: '', videoUrl: '' })

export const QuestionForm = ({ nextDisplayOrder, onCreated }) => {
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState([emptyOption(), emptyOption()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [timerSeconds, setTimerSeconds] = useState()

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, [field]: value } : o)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const text = questionText.trim()
    const cleanedOptions = options
      .map((o) => ({ text: o.text.trim(), videoUrl: o.videoUrl.trim() }))
      .filter((o) => o.text)
    const seconds = Number(timerSeconds)

    if (!text || cleanedOptions.length < 2) {
      setError('Add a question and at least two options.')
      return
    }

    if (!Number.isInteger(seconds) || seconds < 5 || seconds > 15) {
      setError('Timer must be a whole number between 5 and 15 seconds.')
      return
    }

    setSaving(true)
    try {
      await createQuestion({
        questionText: text,
        options: cleanedOptions,
        displayOrder: nextDisplayOrder,
        timerSeconds: seconds
      })
      setQuestionText('')
      setOptions([emptyOption(), emptyOption()])
      setTimerSeconds(15)
      await onCreated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h6" component="h1">Create New question</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
        label="Question text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        fullWidth
      />
      <TextField
          label="Timer (seconds)"
          type="number"
          value={timerSeconds}
          onChange={(e) => setTimerSeconds(e.target.value)}
          sx={{ minWidth: 150 }}
        />
      </Stack>
      
      {options.map((option, index) => (
        <Paper key={index} elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Stack spacing={1.5}>
            <TextField
              label={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => updateOption(index, 'text', e.target.value)}
              fullWidth
            />
            <TextField
              label="Video URL if this option wins"
              placeholder="Enter video URL"
              value={option.videoUrl}
              onChange={(e) => updateOption(index, 'videoUrl', e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        </Paper>
      ))}

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" spacing={1.5}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => setOptions((p) => [...p, emptyOption()])}>
          Add option
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={saving}>
          {saving ? 'Saving…' : 'Create question'}
        </Button>
      </Stack>
      <Typography variant="body2" color="textSecondary">
        After creating your questions, link each option to the question that should follow it from the list.
      </Typography>
    </Stack>
  )
}
