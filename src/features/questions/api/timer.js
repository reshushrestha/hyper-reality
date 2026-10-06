import { supabase } from "../../../lib/supabaseClient"

export const startTimer = async (questionId, seconds = 15) => {
  const { error } = await supabase.rpc('start_timer', {
    p_question_id: questionId,
    p_seconds: seconds,
  })
  if (error) throw error
}
