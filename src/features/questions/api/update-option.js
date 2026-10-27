import { supabase } from '../../../lib/supabaseClient.js'

export const updateOption = async (optionId, patch) => {
  const { error } = await supabase.from('options').update(patch).eq('id', optionId)
  if (error) throw error
}
