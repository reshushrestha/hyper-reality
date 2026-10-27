import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Stack, Typography } from '@mui/material'
import { CenteredPage } from '../../components/layout/centered-page.jsx'
import { voterStorage } from '../../features/voters/utils/voter-storage.js'
import { useActiveQuestion } from '../../features/questions/hooks/use-active-question.js'
import { useCastVote } from '../../features/voting/hooks/use-cast-vote.js'
import { VoteOptions } from '../../features/voting/components/vote-options.jsx'

import Timer from '../../components/timer.jsx'
import { useQuestionTimer } from '../../features/questions/hooks/use-question-timer.js'
import { useSessionState } from '../../features/session/hooks/use-session-state.js'
import { useSessionTimer } from '../../features/session/hooks/use-session-timer.js'
import { useCurrentQuestion } from '../../features/session/hooks/use-current-question.js'
import { IdleScreen } from '../../features/voting/components/idle-screen.jsx'
import { useLiveResults } from '../../features/results/hooks/use-live-results.js'
import { ResultBars } from '../../features/results/components/result-bars.jsx'

const QUESTION_PHASES = ['question', 'voting', 'results']

export const VoteRoute = () => {
  const navigate = useNavigate()
  const voterId = voterStorage.getId()
  const voterName = voterStorage.getName()

  useEffect(() => {
    if (!voterId) navigate('/')
  }, [voterId, navigate])

  const { state, loading } = useSessionState()
  const timer = useSessionTimer(state) // voter phones only display it; display/admin close voting
  const phase = state?.phase
  const questionId = QUESTION_PHASES.includes(phase) ? state.current_question_id : null

  const { question } = useCurrentQuestion(questionId)
  const { myVoteOptionId, submitting, error, castVote } = useCastVote({
    questionId,
    voterId,
    onInvalidVoter: () => {
      voterStorage.clear()
      navigate('/')
    },
  });

  const { counts } = useLiveResults(phase === 'results' ? questionId : null, phase)

  if (!voterId) return null

  if (loading || !state) {
    return (
      <CenteredPage>
        <Typography variant="h5" component="h1">Loading…</Typography>
      </CenteredPage>
    )
  }

  if (phase === 'ended') {
    return (
      <CenteredPage>
        <Stack spacing={1.5} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h1">Thank you for taking part!</Typography>
          <Typography color="textSecondary">The session has ended.</Typography>
        </Stack>
      </CenteredPage>
    )
  }

  if (!QUESTION_PHASES.includes(phase)) {
    return (
      <CenteredPage>
        <IdleScreen/>
      </CenteredPage>
    )
  }

  if (!question) {
    return (
      <CenteredPage>
        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Typography variant="overline" fontWeight={600}>
            Signed in as {voterName || 'you'}
          </Typography>
          <Typography variant="h4" component="h2">Waiting for the next question</Typography>
        </Stack>
      </CenteredPage>
    )
  }

  if (phase === 'results') {
    const myOption = question.options.find((o) => o.id === myVoteOptionId)
    return (
      <CenteredPage maxWidth={480}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="overline" component="h1" sx={{ fontWeight: 600 }}>
              Voting result
            </Typography>
            <Typography variant="h5" component="h2" sx={{ lineHeight: 1.25 }}>
              {question.question_text}
            </Typography>
          </Stack>
          <ResultBars options={question.options} counts={counts} winningOptionId={state.winning_option_id} />
          <Typography variant="body2" color="textSecondary" role="status">
            {myOption ? `You voted for “${myOption.option_text}”.` : "You didn't vote on this one."}
          </Typography>
        </Stack>
      </CenteredPage>
    )
  }

  const votingClosed = phase === 'voting' && timer.expired

  return (
    <CenteredPage maxWidth={480}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="overline" fontWeight={600} component="h1">
            Live question
          </Typography>

          <Timer secondsLeft={timer.secondsLeft} seconds={state.timer_seconds} size="large" />

          <Typography variant="h5" sx={{ lineHeight: 1.25 }} component="h2">
            {question.question_text}
          </Typography>
        </Stack>

        <VoteOptions
          options={question.options}
          myVoteOptionId={myVoteOptionId}
          submitting={submitting}
          disabled={votingClosed}
          onVote={castVote}
        />

        {error && <Alert severity="warning">{error}</Alert>}
        {votingClosed && !myVoteOptionId && (
          <Typography color="textSecondary" role="status">Time is up. Results coming…</Typography>
        )}
      </Stack>
    </CenteredPage>
  )
}
