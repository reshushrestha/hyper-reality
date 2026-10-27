import { supabase } from '../../../lib/supabaseClient.js'

export const getServerTime = async () => {
  const { data, error } = await supabase.rpc('server_now')
  if (error) throw error
  return data
}
