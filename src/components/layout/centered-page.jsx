import { Box, Container, Paper } from '@mui/material'

export const CenteredPage = ({ children, maxWidth = 440, background }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 3,
      background:
        background ??
        'radial-gradient(circle at 20% 10%, #fbf3df 0%, #f6f4ee 45%)',
    }}
  >
    <Container disableGutters sx={{ maxWidth, m: 0 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: '#fff',
          boxShadow: 'none',
        }}
      >
        {children}
      </Paper>
    </Container>
  </Box>
)
