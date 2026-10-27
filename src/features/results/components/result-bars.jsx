import { Stack } from '@mui/material'
import { ResultBar } from './result-bar.jsx'

export const ResultBars = ({ options, counts, winningOptionId, tone = 'light', spacing = 2.5 }) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const max = Math.max(0, ...Object.values(counts))

  return (
    <Stack spacing={spacing}>
      {options.map((option) => {
        const count = counts[option.id] || 0
        const percent = total ? Math.round((count / total) * 100) : 0
        const isWinner = Boolean(winningOptionId) && option.id === winningOptionId
        const isLeader = !winningOptionId && max > 0 && count === max
        return (
          <ResultBar
            key={option.id}
            label={option.option_text}
            count={count}
            percent={percent}
            highlight={isWinner || isLeader}
            badge={isWinner ? 'Winner' : undefined}
            tone={tone}
          />
        )
      })}
    </Stack>
  )
}
