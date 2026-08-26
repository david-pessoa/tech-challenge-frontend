import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { UserProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
