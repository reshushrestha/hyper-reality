import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'

// Returns: undefined while checking, null when signed out, a Session when signed in.
export const useSession = () => {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  return session
}
