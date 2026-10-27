import { Box, Typography } from '@mui/material'

export const IdleScreen = () => (
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
