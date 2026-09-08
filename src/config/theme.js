import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e0a730', // amber
      contrastText: '#2a1f04',
    },
    secondary: {
      main: '#14161c', // ink
      contrastText: '#f6f4ee',
    },
    background: {
      default: '#f6f4ee', // paper
      paper: '#ffffff',
    },
    text: {
      primary: '#14161c',
      secondary: '#55584f',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    h2: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    h3: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    h4: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, padding: '10px 18px' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
})

// Dark variant used for the projector/display screen
export const displayTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: { main: '#e0a730', contrastText: '#2a1f04' },
    background: { default: '#14161c', paper: '#1e212b' },
    text: { primary: '#f6f4ee', secondary: 'rgba(246,244,238,0.65)' },
  },
  typography: theme.typography,
  shape: theme.shape,
  components: theme.components,
})
