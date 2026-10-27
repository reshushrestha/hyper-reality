import { useEffect, useState } from 'react'
import { getServerTime } from '../api/get-server-time.js'

// How many ms the server clock is ahead of this device's clock. Phones are
// often a few seconds off, which would make countdowns disagree between screens.
export const useServerOffset = () => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let cancelled = false

    const sync = () => {
      const t0 = Date.now()
      getServerTime()
        .then((server) => {
          if (cancelled) return
          const t1 = Date.now()
          setOffset(new Date(server).getTime() - (t0 + t1) / 2)
        })
        .catch(() => {
          /* keep the previous offset */
        })
    }

    sync()
    const id = setInterval(sync, 60000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return offset
}
