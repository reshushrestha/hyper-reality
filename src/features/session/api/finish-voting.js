import { supabase } from '../../../lib/supabaseClient.js'

// Safe for any screen to call: the database ignores it until the timer is up.
export const finishVoting = async () => {
  const { error } = await supabase.rpc('finish_voting')
  if (error) throw error
}
