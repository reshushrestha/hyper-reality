import { supabase } from '../../../lib/supabaseClient.js'

export const logout = () => supabase.auth.signOut()
