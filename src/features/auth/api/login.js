import { supabase } from '../../../lib/supabaseClient.js'

export const login = async ({ email, password }) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error('Wrong email or password.')
  }
}
