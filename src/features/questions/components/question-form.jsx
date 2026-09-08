import { useState } from 'react'
import { Stack, TextField, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createQuestion } from '../api/create-question.js'

export const QuestionForm = ({ nextDisplayOrder, onCreated }) => {
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [saving, setSaving] = useState(false)

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)))
  }

  const addOptionField = () => setOptions((prev) => [...prev, ''])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = questionText.trim()
    const cleanedOptions = options.map((o) => o.trim()).filter(Boolean)
    if (!text || cleanedOptions.length < 2) return

    setSaving(true)
    try {
      await createQuestion({
        questionText: text,
        options: cleanedOptions,
        displayOrder: nextDisplayOrder,
      })
      setQuestionText('')
      setOptions(['', ''])
      onCreated?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mb: 5 }}>
      <TextField
        label="Question text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        fullWidth
      />
      {options.map((option, index) => (
        <TextField
          key={index}
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) => updateOption(index, e.target.value)}
          fullWidth
        />
      ))}
      <Stack direction="row" spacing={1.5}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={addOptionField}>
          Add option
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={saving}>
          {saving ? 'Saving…' : 'Create question'}
        </Button>
      </Stack>
    </Stack>
  )
}
