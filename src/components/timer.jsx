import { Box, LinearProgress, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

/**
 * Display only. The countdown comes from useQuestionTimer,
 * so the admin, user and screen pages all show the same value.
 */
const Timer = ({ secondsLeft, seconds = 15, size = 'medium' }) => {
  const urgent = secondsLeft <= 5 && secondsLeft > 0
  const color = urgent ? 'error.main' : 'primary.main'
  const big = size === 'large'

  return (
    <Box role="timer" sx={{ width: '100%', color }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: big ? 2 : 1,
        }}
      >
        <AccessTimeIcon sx={{ fontSize: big ? 64 : 24 }}></AccessTimeIcon>
        <Typography
          component="span"
          sx={{
            fontSize: big ? 96 : 32,
            fontWeight: 600,
            lineHeight: 1,
            color: 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          0:{String(secondsLeft).padStart(2, '0')}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        color={urgent ? 'error' : 'primary'}
        value={(secondsLeft / seconds) * 100}
        sx={{
          mt: 1.25,
          height: 4,
          borderRadius: 2,
          '& .MuiLinearProgress-bar': { transition: 'transform 1s linear' },
        }}
      />
    </Box>
  )
}

export default Timer
