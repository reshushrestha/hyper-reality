const getEnvVar = (key, { required = true } = {}) => {
  const value = import.meta.env[key]
  if (required && !value) {
    // eslint-disable-next-line no-console
    console.error(
      `Missing required env var ${key}. Copy .env.example to .env and fill it in.`
    )
  }
  return value
}

export const env = {
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL'),
  supabasePublishableKey: getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY'),
}
