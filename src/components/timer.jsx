import { Box, LinearProgress, SvgIcon, Typography } from '@mui/material'

const ClockIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </SvgIcon>
)

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
        <ClockIcon sx={{ fontSize: big ? 64 : 24 }} />
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
