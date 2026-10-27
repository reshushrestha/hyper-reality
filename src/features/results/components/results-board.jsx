import { Box, Stack, Typography } from '@mui/material'
import Timer from '../../../components/timer.jsx'
import { ResultBars } from './result-bars.jsx'

export const ResultsBoard = ({
  phase,
  questionText,
  options,
  counts,
  totalVoters,
  winningOptionId,
  secondsLeft,
  timerSeconds,
}) => {
  const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        color: '#fff',
        px: { xs: 4, md: 10 },
        py: { xs: 5, md: 8 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" sx={{ mb: 5, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.65)' }}>
          {totalVotes} of {totalVoters} responded
        </Typography>

        {phase !== 'results' && (
          <Box sx={{ width: 380 }}>
            <Timer secondsLeft={secondsLeft} seconds={timerSeconds} size="large" onDark />
          </Box>
        )}
      </Stack>

      <Typography
        variant="h3"
        component="h1"
        sx={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', lineHeight: 1.15, mb: 7, maxWidth: 1000, fontWeight: 600 }}
      >
        {questionText}
      </Typography>

      <Box sx={{ maxWidth: 1000 }}>
        <ResultBars
          options={options}
          counts={counts}
          winningOptionId={phase === 'results' ? winningOptionId : null}
          tone="dark"
          spacing={4}
        />
      </Box>
    </Box>
  )
}
