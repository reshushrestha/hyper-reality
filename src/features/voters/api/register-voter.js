import { supabase } from '../../../lib/supabaseClient.js'

export const registerVoter = async ({ name, email }) => {
  const { data, error } = await supabase.rpc('register_voter', {
    p_name: name,
    p_email: email,
  })
  if (error || !data) {
    throw new Error("Couldn't join right now. Try again.")
  }
  return { id: data }
}
