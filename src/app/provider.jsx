import { ThemeProvider, CssBaseline } from '@mui/material'

export const AppProvider = ({ children }) => (
  <>
    <CssBaseline />
    {children}
  </>
)
