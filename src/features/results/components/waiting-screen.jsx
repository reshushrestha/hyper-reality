import { Box, Stack, Typography } from '@mui/material'

export const WaitingScreen = () => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6
    }}
  >
    <Typography variant="h4">
      Waiting for the next question
    </Typography>
  </Box>
)
