import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

// Muted required for autoplay, not clickable. Can change firefox mozilla settings to bypass but need to test
export const VideoBackground = ({ videoUrl, dimmed = false }) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    const attempt = el.play?.()
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
  }, [videoUrl])

  if (!videoUrl) return null

  return (
    <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, bgcolor: '#000' }}>
      <Box
        component="video"
        ref={ref}
        key={videoUrl}
        src={videoUrl}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
        sx={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(11, 12, 16, 0.62)',
          opacity: dimmed ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
    </Box>
  )
}
