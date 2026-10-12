import { useState } from 'react'
import { Box, Container, Stack, Typography, Button } from '@mui/material'
import { CenteredPage } from '../../components/layout/centered-page.jsx'
import { useSession } from '../../features/auth/hooks/use-session.js'
import { LoginForm } from '../../features/auth/components/login-form.jsx'
import { logout } from '../../features/auth/api/logout.js'
import { useQuestions } from '../../features/questions/hooks/use-questions.js'
import { QuestionForm } from '../../features/questions/components/question-form.jsx'
import { QuestionList } from '../../features/questions/components/question-list.jsx'
import { JoinQrCode } from '../../features/questions/components/join-qr-code.jsx'

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
  const { questions } = useQuestions()
  const [showQr, setShowQr] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="sm">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1"> Admin:Questions for Voting</Typography>
          <Button variant="outlined" color="primary" onClick={() => setShowQr((v) => !v)}>
            {showQr ? 'Hide join QR' : 'Show join QR'}
          </Button>
          <Button variant="outlined" color="primary" onClick={() => logout()}>
            Sign out
          </Button>
        </Stack>

        {showQr && <JoinQrCode />}

<Typography variant="h5" component="h2">Create a New Question </Typography>
        <QuestionForm nextDisplayOrder={questions.length} />
        <Typography variant="h5" component="h2">Drafted and Live Questions</Typography>
          <QuestionList questions={questions} />
      </Container>
    </Box>
  )
}
