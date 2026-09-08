import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'
import { CenteredPage } from '../../components/layout/centered-page.jsx'
import { voterStorage } from '../../features/voters/utils/voter-storage.js'
import { useActiveQuestion } from '../../features/questions/hooks/use-active-question.js'
import { useCastVote } from '../../features/voting/hooks/use-cast-vote.js'
import { VoteOptions } from '../../features/voting/components/vote-options.jsx'

export const VoteRoute = () => {
  const navigate = useNavigate()
  const voterId = voterStorage.getId()

  useEffect(() => {
    if (!voterId) navigate('/')
  }, [voterId, navigate])

  const { question, options, loading } = useActiveQuestion()
  const { myVoteOptionId, submitting, castVote } = useCastVote({
    questionId: question?.id,
    voterId,
  })

  if (!voterId) return null

  if (loading) {
    return (
      <CenteredPage>
        <Typography variant="h5">Loading…</Typography>
      </CenteredPage>
    )
  }

  if (!question) {
    return (
      <CenteredPage>
        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Typography variant="overline" fontWeight={600}>
            Signed in as {voterStorage.getName() || 'you'}
          </Typography>
          <Typography variant="h4">Waiting for the next question</Typography>
        </Stack>
      </CenteredPage>
    )
  }

  return (
    <CenteredPage maxWidth={480}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="overline" fontWeight={600}>
            Live question
          </Typography>
          <Typography variant="h5" sx={{ lineHeight: 1.25 }}>
            {question.question_text}
          </Typography>
        </Stack>

        <VoteOptions
          options={options}
          myVoteOptionId={myVoteOptionId}
          submitting={submitting}
          onVote={castVote}
        />
      </Stack>
    </CenteredPage>
  )
}
