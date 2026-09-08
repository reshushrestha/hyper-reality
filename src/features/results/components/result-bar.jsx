import { Box, Stack, Typography, LinearProgress } from '@mui/material'

export const ResultBar = ({ label, count, percent, isLeader }) => (
  <Box>
    <Stack direction="column" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1.25 }}>
      <Typography variant="h6" fontWeight={500}>
        {label}
      </Typography>
      <Typography>
        {count} | {percent}%
      </Typography>
    </Stack>
    <LinearProgress
      variant="determinate"
      value={percent}
    />
  </Box>
)
