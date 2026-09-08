import { Box, Stack, Typography } from '@mui/material'
import { ResultBar } from './result-bar.jsx'

export const ResultsBoard = ({ questionText, options, counts, totalVoters }) => {
  const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0)
  const maxCount = Math.max(0, ...Object.values(counts))

  return (
    <Box sx={{ minHeight: '80vh', px: { xs: 4, md: 9 }, py: { xs: 6, md: 8 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Typography sx={{ fontSize: '1.1rem' }}>
          {totalVotes} of {totalVoters} responded
        </Typography>
      </Stack>

      <Typography
        variant="h3"
        sx={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.15, mb: 7, maxWidth: 900 }}
      >
        {questionText}
      </Typography>

      <Stack spacing={4} sx={{ maxWidth: 900 }}>
        {options.map((option) => {
          const count = counts[option.id] || 0
          const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0
          return (
            <ResultBar
              key={option.id}
              label={option.option_text}
              count={count}
              percent={percent}
              isLeader={maxCount > 0 && count === maxCount}
            />
          )
        })}
      </Stack>
    </Box>
  )
}
