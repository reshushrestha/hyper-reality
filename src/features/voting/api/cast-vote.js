import { supabase } from '../../../lib/supabaseClient.js'

export const castVote = ({ questionId, optionId, voterId }) =>
  supabase.from('votes').insert({
    question_id: questionId,
    option_id: optionId,
    voter_id: voterId,
  })
