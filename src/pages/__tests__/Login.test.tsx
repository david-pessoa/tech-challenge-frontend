import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Login from '../Login';
import { renderWithProviders } from '../../tests/test-utils';
import { login } from '../../services/auth.service';

const navigateMock = vi.fn();

vi.mock('../../services/auth.service', () => ({
  login: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function renderLogin() {
  return renderWithProviders(<Login />);
}

function mockLoginSuccess() {
  vi.mocked(login).mockResolvedValueOnce({
    message: 'Login realizado com sucesso!',
    usuario: {
      id: 'user-id',
      nome: 'Pedro',
      matricula: '450622',
      role: 'ADMIN',
      image: null,
    },
  });
}

function mockLoginError(message = 'Matrícula ou senha inválidas') {
  vi.mocked(login).mockRejectedValueOnce(new Error(message));
}

async function submitLoginForm(matricula: string, senha: string) {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Matrícula'), matricula);
  await user.type(screen.getByLabelText('Senha'), senha);
  await user.click(screen.getByRole('button', { name: 'Login' }));
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve apresentar os campos do formulário de login', () => {
    renderLogin();

    expect(screen.getByLabelText('Matrícula')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('deve alternar a visibilidade da senha', async () => {
    const user = userEvent.setup();

    renderLogin();

    const passwordInput = screen.getByLabelText('Senha');
    const toggleButton = screen.getByRole('button', { name: 'Mostrar senha' });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeInTheDocument();
  });

  it('deve apresentar erro ao tentar entrar com senha inválida', async () => {
    const loginMock = vi.mocked(login);

    mockLoginError();
    renderLogin();

    await submitLoginForm('450622', 'senhaErrada');

    expect(await screen.findByRole('alert')).toHaveTextContent('Matrícula ou senha inválidas');
    expect(loginMock).toHaveBeenCalledWith('450622', 'senhaErrada');
  });

  it('deve apresentar erro ao tentar entrar com matrícula inválida', async () => {
    const loginMock = vi.mocked(login);

    mockLoginError();
    renderLogin();

    await submitLoginForm('000000', 'Pedro123');

    expect(await screen.findByRole('alert')).toHaveTextContent('Matrícula ou senha inválidas');
    expect(loginMock).toHaveBeenCalledWith('000000', 'Pedro123');
  });

  it('não deve tentar login sem preencher matrícula e senha', async () => {
    const user = userEvent.setup();
    const loginMock = vi.mocked(login);

    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(loginMock).not.toHaveBeenCalled();
  });

  it('deve realizar login e redirecionar com sucesso', async () => {
    const refreshUserMock = vi.fn().mockResolvedValue(undefined);

    mockLoginSuccess();
    renderWithProviders(<Login />, { refreshUser: refreshUserMock });

    await submitLoginForm('450622', 'Pedro123');

    expect(login).toHaveBeenCalledWith('450622', 'Pedro123');
    expect(refreshUserMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
