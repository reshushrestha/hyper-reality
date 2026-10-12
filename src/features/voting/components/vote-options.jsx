import { Stack, Paper, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

export const VoteOptions = ({ options, myVoteOptionId, submitting, onVote, readonly = false }) => (
  <Stack spacing={1.5}>
    {options.map((option) => {
      const isMine = myVoteOptionId === option.id
      const isLocked = Boolean(myVoteOptionId)

      return (
        <Paper
          key={option.id}
          component="button"
          onClick={() => onVote(option.id)}
          disabled={isLocked || submitting || readonly}
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left',
            p: '16px 18px',
            borderRadius: 3,
            border: '1px solid',
            borderColor: isMine ? 'warning.main' : 'divider',
            bgcolor: isMine ? '#fdf3df' : '#fff',
            cursor: isLocked ? 'default' : 'pointer',
            font: 'inherit',
            fontSize: '1.05rem',
            fontWeight: 500,
            opacity: isLocked && !isMine ? 0.45 : 1,
            transition: 'border-color 0.15s, background 0.15s',
            '&:disabled': { color: 'inherit' },
          }}
        >
          <span>{option.option_text}</span>
          {isMine && <CheckIcon color="warning" fontSize="small" />}
        </Paper>
      )
    })}
    {myVoteOptionId && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} role="status">
        Your vote is in. Thanks for weighing in.
      </Typography>
    )}
  </Stack>
)
