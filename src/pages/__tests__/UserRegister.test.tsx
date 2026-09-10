import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UserRegister from '../UserRegister';
import { renderWithProviders } from '../../tests/test-utils';
import { createUser } from '../../services/user.service';
import type { User } from '../../types/User';

const adminUser: User = {
  id: 'admin-id',
  nome: 'Marcela',
  matricula: '2020',
  role: 'ADMIN',
  image: '',
};

const professorUser: User = {
  id: 'professor-id',
  nome: 'Pedro',
  matricula: '450622',
  role: 'PROFESSOR',
  image: '',
};

const navigateMock = vi.fn();

vi.mock('../../services/user.service', () => ({
  createUser: vi.fn(),
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function renderUserRegister(user = adminUser) {
  return renderWithProviders(<UserRegister isNew={true} />, { user });
}

async function fillRequiredFields() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/nome completo/i), 'Maria Souza');
  await user.type(screen.getByLabelText(/matrícula/i), '123456');
  await user.type(screen.getByLabelText(/^senha/i), 'Maria123');
  await user.type(screen.getByLabelText(/confirme sua senha/i), 'Maria123');

  return user;
}

describe('UserRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve apresentar os campos do formulário de cadastro de usuário', () => {
    renderUserRegister();

    expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matrícula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de acesso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirme sua senha/i)).toBeInTheDocument();
  });

  it('deve manter o botão salvar desabilitado enquanto campos obrigatórios não forem preenchidos', () => {
    renderUserRegister();

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });

  it('deve apresentar erro quando as senhas não conferem', async () => {
    const user = userEvent.setup();

    renderUserRegister();

    await user.type(screen.getByLabelText(/^senha/i), 'Maria123');
    await user.type(screen.getByLabelText(/confirme sua senha/i), 'Outra123');

    expect(screen.getByText('As senhas não conferem.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });

  it('deve deixar professor cadastrar apenas usuário aluno', () => {
    renderUserRegister(professorUser);

    const roleSelect = screen.getByLabelText(/tipo de acesso/i);

    expect(roleSelect).toBeDisabled();
    expect(roleSelect).toHaveValue('ALUNO');
  });

  it('deve chamar criação de usuário ao salvar cadastro válido', async () => {
    vi.mocked(createUser).mockResolvedValueOnce({});

    renderUserRegister();

    const user = await fillRequiredFields();

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(createUser).toHaveBeenCalledTimes(1));

    const userData = vi.mocked(createUser).mock.calls[0][0] as FormData;

    expect(userData.get('nome')).toBe('Maria Souza');
    expect(userData.get('matricula')).toBe('123456');
    expect(userData.get('role')).toBe('ALUNO');
    expect(userData.get('senha')).toBe('Maria123');
    expect(navigateMock).toHaveBeenCalledWith('/user/list', {
      state: { toastMessage: 'Usuário cadastrado com sucesso.' },
    });
  });

  it('deve apresentar toast ao tentar cadastrar usuário com matrícula já cadastrada', async () => {
    vi.mocked(createUser).mockRejectedValueOnce(new Error('Matrícula já cadastrada'));

    renderUserRegister();

    const user = await fillRequiredFields();

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Matrícula já cadastrada')).toBeInTheDocument();
  });
});
