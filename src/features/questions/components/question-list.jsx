import { Stack, Typography } from '@mui/material'
import { QuestionCard } from './question-card.jsx'

export const QuestionList = ({ questions, onChanged }) => {
  if (questions.length === 0) {
    return <Typography color="textSecondary">No questions yet — create one above.</Typography>
  }

  return (
    <Stack spacing={2}>
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} allQuestions={questions} onChanged={onChanged} />
      ))}
    </Stack>
  )
}
