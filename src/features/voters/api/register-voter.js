import { supabase } from '../../../lib/supabaseClient.js'

export const registerVoter = async ({ name, email }) => {
  const { data: existing } = await supabase
    .from('voters')
    .select('id')
    .ilike('email', email)
    .maybeSingle()

  if (existing?.id) {
    return { id: existing.id }
  }

  const { data, error } = await supabase
    .from('voters')
    .insert({ name, email })
    .select('id')
    .single()

  if (error) {
    throw new Error("Couldn't join right now. Try again.")
  }

  return { id: data.id }
}
