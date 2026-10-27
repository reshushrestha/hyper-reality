import { Box, LinearProgress, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const formatTime = (totalSeconds) => {
  const s = Math.max(0, totalSeconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Display only. The countdown comes from useSessionTimer,
 * so the admin, user and screen pages all show the same value.
 */
const Timer = ({ secondsLeft, seconds = 15, size = 'medium', onDark = false }) => {
  const urgent = secondsLeft <= 5 && secondsLeft > 0
  const color = urgent ? (onDark ? 'error.light' : 'error.main') : onDark ? '#fff' : 'primary.main'
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
            color: onDark ? '#fff' : 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatTime(secondsLeft)}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        color={urgent ? 'error' : 'primary'}
        value={seconds > 0 ? Math.min(100, (secondsLeft / seconds) * 100) : 0}
        sx={{
          mt: 1.25,
          height: 4,
          borderRadius: 2,
          ...(onDark && { bgcolor: 'rgba(255,255,255,0.25)' }),
          '& .MuiLinearProgress-bar': { transition: 'transform 1s linear' },
        }}
      />
    </Box>
  )
}

export default Timer
