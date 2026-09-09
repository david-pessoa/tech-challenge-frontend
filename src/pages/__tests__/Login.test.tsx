import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Login from '../Login';
import { renderWithProviders } from '../../tests/test-utils';
import { login } from '../../services/auth.service';

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('deve apresentar erro ao tentar entrar com senha inválida', async () => {
    const user = userEvent.setup();
    const loginMock = vi.mocked(login);

    loginMock.mockRejectedValueOnce(new Error('Matrícula ou senha inválidas'));

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText('Matrícula'), '450622');
    await user.type(screen.getByLabelText('Senha'), 'senhaErrada');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Matrícula ou senha inválidas');
    expect(loginMock).toHaveBeenCalledWith('450622', 'senhaErrada');
  });

  it('deve apresentar erro ao tentar entrar com matrícula inválida', async () => {
    const user = userEvent.setup();
    const loginMock = vi.mocked(login);

    loginMock.mockRejectedValueOnce(new Error('Matrícula ou senha inválidas'));

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText('Matrícula'), '000000');
    await user.type(screen.getByLabelText('Senha'), 'Pedro123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Matrícula ou senha inválidas');
    expect(loginMock).toHaveBeenCalledWith('000000', 'Pedro123');
  });

  it('não deve tentar login sem preencher matrícula e senha', async () => {
    const user = userEvent.setup();
    const loginMock = vi.mocked(login);

    renderWithProviders(<Login />);

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(loginMock).not.toHaveBeenCalled();
  });
});
