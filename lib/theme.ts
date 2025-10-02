import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0B5FFF' },
    secondary: { main: '#6B7280' },
  },
  typography: {
    fontSize: 14,
  },
});

export default theme;
