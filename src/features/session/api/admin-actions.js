import { supabase } from '../../../lib/supabaseClient.js'

const call = async (fn, args) => {
  const { error } = await supabase.rpc(fn, args)
  if (error) throw new Error(error.message)
}

// One function per button in the admin flow chart.
export const startSession = () => call('admin_start_session')
export const sendQuestion = () => call('admin_send_question')
export const startTimer = () => call('admin_start_timer')
export const nextVideo = () => call('admin_next_video')
export const endSession = () => call('admin_end_session')
export const setIntroVideo = (url) => call('admin_set_intro_video', { p_url: url })
