import { Stack, Paper, Typography, Button, Chip } from '@mui/material'
import { activateQuestion } from '../api/activate-question.js'
import { closeQuestion } from '../api/close-question.js'

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'default' },
  active: { label: 'Live now', color: 'warning' },
  closed: { label: 'Closed', color: 'default' },
}

export const QuestionList = ({ questions }) => {
  if (questions.length === 0) {
    return (
      <Typography color="text.secondary">
        No questions yet. Create one above.
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5}>
      {questions.map((q) => (
        <Paper
          key={q.id}
          elevation={0}
          sx={{
            p: 2.25,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack spacing={0.5}>
            <Typography fontWeight={600}>{q.question_text}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {q.options?.length || 0} options
              </Typography>
              <Chip
                size="small"
                label={STATUS_CONFIG[q.status].label}
                color={STATUS_CONFIG[q.status].color}
                variant={q.status === 'active' ? 'filled' : 'outlined'}
              />
            </Stack>
          </Stack>

          {q.status !== 'active' ? (
            <Button variant="contained" color="warning" size="small" onClick={() => activateQuestion(q.id)}>
              Send live
            </Button>
          ) : (
            <Button variant="outlined" color="primary" size="small" onClick={() => closeQuestion(q.id)}>
              Close voting
            </Button>
          )}
        </Paper>
      ))}
    </Stack>
  )
}
