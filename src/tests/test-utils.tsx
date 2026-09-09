import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { vi } from 'vitest';

import { UserContext } from '../context/AuthContext';
import { theme } from '../styles/theme';
import type { User } from '../types/User';

type RenderOptions = {
  route?: string;
  user?: User;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', user }: RenderOptions = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider
          value={{
            user,
            isLoading: false,
            refreshUser: vi.fn(),
          }}
        >
          {ui}
        </UserContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  );
}
