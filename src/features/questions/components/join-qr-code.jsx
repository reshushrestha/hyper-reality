import { Paper, Stack, Typography } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'

export const JoinQrCode = () => {
  const joinUrl = `${window.location.origin}/`

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
      }}
    >
      <QRCodeSVG value={joinUrl} size={140} />
      <Stack spacing={0.5}>
        <Typography fontWeight={600}>Scan to join</Typography>
        <Typography variant="body2" color="text.secondary">
          {joinUrl}
        </Typography>
      </Stack>
    </Paper>
  )
}
