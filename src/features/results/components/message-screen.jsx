import { Box, Stack, Typography } from '@mui/material'

export const MessageScreen = ({ title, subtitle }) => (
  <Box
    sx={{
      position: 'relative',
      zIndex: 1,
      minHeight: '100vh',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      px: 4,
    }}
  >
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      <Typography variant="h3" sx={{ fontWeight: 500, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
          {subtitle}
        </Typography>
      )}
    </Stack>
  </Box>
)
