import { useState } from 'react'
import { Box, Button, Container, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { CenteredPage } from '../../components/layout/centered-page.jsx'
import { useSession } from '../../features/auth/hooks/use-session.js'
import { LoginForm } from '../../features/auth/components/login-form.jsx'
import { logout } from '../../features/auth/api/logout.js'
import { useQuestions } from '../../features/questions/hooks/use-questions.js'
import { QuestionForm } from '../../features/questions/components/question-form.jsx'
import { QuestionList } from '../../features/questions/components/question-list.jsx'
import Timer from '../../components/timer.jsx'
import { useSessionState } from '../../features/session/hooks/use-session-state.js'
import { useSessionTimer } from '../../features/session/hooks/use-session-timer.js'
import { useCurrentQuestion } from '../../features/session/hooks/use-current-question.js'
import { SessionControl } from '../../features/session/components/session-control.jsx'
import { IntroVideoField } from '../../features/session/components/intro-video-field.jsx'
import { useLiveResults } from '../../features/results/hooks/use-live-results.js'
import { ResultBars } from '../../features/results/components/result-bars.jsx'

const QUESTION_PHASES = ['question', 'voting', 'results']

export const AdminRoute = () => {
  const session = useSession()

  if (session === undefined) return null

  return session ? <AdminDashboard /> : (
    <CenteredPage maxWidth={360}>
      <LoginForm />
    </CenteredPage>
  )
}

const AdminDashboard = () => {
  const [tab, setTab] = useState(0)
  const [showQr, setShowQr] = useState(false)

  const { state, refetch: refetchState } = useSessionState()
  const timer = useSessionTimer(state, { autoFinish: true })
  const { questions, error: questionsError, refetch: refetchQuestions } = useQuestions()

  const phase = state?.phase
  const questionId = QUESTION_PHASES.includes(phase) ? state.current_question_id : null
  const { question } = useCurrentQuestion(questionId)
  const { counts, totalVoters } = useLiveResults(questionId, phase)

  const nextQuestion = questions.find((q) => q.id === state?.next_question_id)
  const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="sm">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1"> Admin</Typography>
          <Button variant="outlined" color="primary" onClick={() => logout()}>
            Sign out
          </Button>
        </Stack>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Run session" />
          <Tab label="Questions & videos" />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={3}>
            <SessionControl
              state={state}
              timer={timer}
              nextQuestionText={nextQuestion?.question_text}
              onChanged={refetchState}
            />

            {question && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={2.5}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600 }}>
                      {phase === 'results' ? 'Final result' : 'Live votes'} · {totalVotes} of {totalVoters} responded
                    </Typography>
                    <Typography variant="h6" component="h2">{question.question_text}</Typography>
                  </Stack>
                  {phase !== 'results' && <Timer secondsLeft={timer.secondsLeft} seconds={state.timer_seconds} />}
                  <ResultBars
                    options={question.options}
                    counts={counts}
                    winningOptionId={phase === 'results' ? state.winning_option_id : null}
                  />
                </Stack>
              </Paper>
            )}
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={4}>
            <IntroVideoField value={state?.intro_video_url} onSaved={refetchState} />
            <QuestionForm nextDisplayOrder={questions.length} onCreated={refetchQuestions} />
            {questionsError && <Typography color="error">{questionsError}</Typography>}
            <QuestionList questions={questions} onChanged={refetchQuestions} />
          </Stack>
        )}
      </Container>
    </Box>
  )
}
