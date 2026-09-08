import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, TextField, Button, Typography, Alert } from '@mui/material'
import { registerVoter } from '../api/register-voter.js'
import { voterStorage } from '../utils/voter-storage.js'

export const JoinForm = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Enter your name and email to continue.')
      return
    }

    setLoading(true)
    try {
      const { id } = await registerVoter({ name: name.trim(), email: email.trim() })
      voterStorage.save({ id, name: name.trim() })
      navigate('/vote')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Join to vote</Typography>
        <Typography color="text.secondary">
          Enter your name and email. You will stay signed in on this device for every question that comes up.
        </Typography>
      </Stack>

      <TextField
        label="Name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
        {loading ? 'Joining…' : 'Continue to voting'}
      </Button>
    </Stack>
  )
}
