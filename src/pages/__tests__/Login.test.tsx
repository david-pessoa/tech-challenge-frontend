import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Login from '../Login';
import { renderWithProviders } from '../../tests/test-utils';

vi.mock('../../services/auth.service', () => ({
  login: vi.fn(),
}));

vi.mock('../../utils/functions', async () => {
  const actual = await vi.importActual<typeof import('../../utils/functions')>(
    '../../utils/functions'
  );

  return {
    ...actual,
    setLocalStorageToken: vi.fn(),
  };
});

describe('Login', () => {
  it('deve apresentar os campos do formulário de login', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText('Matrícula')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('deve alternar a visibilidade da senha', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Senha');
    const toggleButton = screen.getByRole('button', { name: 'Mostrar senha' });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeInTheDocument();
  });
});
