import { useEffect } from 'react'

import { Stack, Paper, Typography, Button, Chip, Box } from '@mui/material'
import { activateQuestion } from '../api/activate-question.js'
import { closeQuestion } from '../api/close-question.js'
import { startTimer } from '../api/timer.js'
import { useQuestionTimer } from '../hooks/use-question-timer.js'

import Timer from '../../../components/timer.jsx'

const TIMER_SECONDS = 15

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'default' },
  active: { label: 'Live now', color: 'warning' },
  closed: { label: 'Closed', color: 'default' },
}

const QuestionRow = ({ q }) => {
  const isActive = q.status === 'active'
  const { secondsLeft, running, finished } = useQuestionTimer(q.id, isActive)

  // When the shared deadline passes, close voting. This also works
  // if the admin refreshes the page mid-countdown.
  useEffect(() => {
    if (finished) closeQuestion(q.id)
  }, [finished, q.id])

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 200 }}>
        <Typography fontWeight={600}>{q.question_text}</Typography>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            {q.options?.length || 0} options
          </Typography>
          <Chip
            size="small"
            label={STATUS_CONFIG[q.status].label}
            color={STATUS_CONFIG[q.status].color}
            variant={isActive ? 'filled' : 'outlined'}
          />
        </Stack>
      </Stack>

      {!isActive ? (
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={() => activateQuestion(q.id)}
        >
          Send live
        </Button>
      ) : (
        <>
          <Box sx={{ width: 150 }}>
            <Timer
              secondsLeft={running ? secondsLeft : TIMER_SECONDS}
              seconds={TIMER_SECONDS}
            />
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              disabled={running}
              onClick={() => startTimer(q.id, TIMER_SECONDS)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Start timer
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => closeQuestion(q.id)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Close voting
            </Button>
          </Stack>
        </>
      )}
    </Paper>
  )
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
        <QuestionRow key={q.id} q={q} />
      ))}
    </Stack>
  )
}
