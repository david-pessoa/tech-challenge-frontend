import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UserList from '../UserList';
import { renderWithProviders } from '../../tests/test-utils';
import { deleteUser, getAllUsers } from '../../services/user.service';
import { getAllPosts } from '../../services/post.service';
import type { User } from '../../types/User';

const adminUser: User = {
  id: 'admin-id',
  nome: 'Marcela',
  matricula: '2020',
  role: 'ADMIN',
  image: '',
};

const anotherAdminUser: User = {
  id: 'another-admin-id',
  nome: 'Ana Admin',
  matricula: '2021',
  role: 'ADMIN',
  image: '',
};

const professorUser: User = {
  id: 'professor-id',
  nome: 'Pedro Professor',
  matricula: '450622',
  role: 'PROFESSOR',
  image: '',
};

const studentUser: User = {
  id: 'student-id',
  nome: 'Maria Aluna',
  matricula: '123456',
  role: 'ALUNO',
  image: '',
};

const users = [adminUser, anotherAdminUser, professorUser, studentUser];

vi.mock('../../services/user.service', () => ({
  deleteUser: vi.fn(),
  getAllUsers: vi.fn(),
}));

vi.mock('../../services/post.service', () => ({
  getAllPosts: vi.fn(),
}));

function renderUserList(user = adminUser) {
  return renderWithProviders(<UserList />, { user });
}

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAllUsers).mockResolvedValue(users);
    vi.mocked(getAllPosts).mockResolvedValue([]);
  });

  it('deve permitir admin excluir alunos, professores e outros administradores', async () => {
    renderUserList(adminUser);

    expect(await screen.findByText('Ana Admin')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deletar Ana Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deletar Pedro Professor' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deletar Maria Aluna' })).toBeInTheDocument();
  });

  it('não deve permitir admin se autoexcluir', async () => {
    renderUserList(adminUser);

    expect(await screen.findByText('Marcela')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Deletar Marcela' })).not.toBeInTheDocument();
  });

  it('não deve permitir professor excluir usuários', async () => {
    renderUserList(professorUser);

    expect(await screen.findByText('Maria Aluna')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /deletar/i })).not.toBeInTheDocument();
  });

  it('não deve apresentar ações de edição ou exclusão para aluno', async () => {
    renderUserList(studentUser);

    await waitFor(() => expect(getAllUsers).toHaveBeenCalledTimes(1));

    expect(screen.queryByRole('link', { name: /editar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /deletar/i })).not.toBeInTheDocument();
  });

  it('deve remover usuário da lista ao confirmar exclusão como admin', async () => {
    const user = userEvent.setup();

    vi.mocked(deleteUser).mockResolvedValueOnce({});

    renderUserList(adminUser);

    await user.click(await screen.findByRole('button', { name: 'Deletar Maria Aluna' }));

    const modal = screen.getByRole('dialog', { name: 'Você deseja remover o usuário "Maria Aluna"?' });

    expect(within(modal).getByText('Você deseja remover o usuário "Maria Aluna"?')).toBeInTheDocument();

    await user.click(within(modal).getByRole('button', { name: 'Remover' }));

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith('student-id'));
    expect(screen.queryByText('Maria Aluna')).not.toBeInTheDocument();
    expect(screen.getByText('O usuário foi deletado com sucesso')).toBeInTheDocument();
  });

  it('deve permitir admin excluir professor com posts vinculados', async () => {
    const user = userEvent.setup();

    vi.mocked(getAllPosts).mockResolvedValueOnce([
      {
        postId: 'post-id-1',
        materia: 'Geral',
        titulo: 'Introdução à Programação',
        descricao: 'Conceitos básicos de programação.',
        autor: 'Pedro Professor',
        criadoPor: {
          userId: 'professor-id',
          nome: 'Pedro Professor',
          tipoUsuario: 'PROFESSOR',
          image: null,
        },
        createdAt: new Date(),
        editedAt: new Date(),
      },
      {
        postId: 'post-id-2',
        materia: 'Geral',
        titulo: 'História do Brasil',
        descricao: 'Aula sobre história.',
        autor: 'Pedro Professor',
        criadoPor: {
          userId: 'professor-id',
          nome: 'Pedro Professor',
          tipoUsuario: 'PROFESSOR',
          image: null,
        },
        createdAt: new Date(),
        editedAt: new Date(),
      },
    ]);
    vi.mocked(deleteUser).mockResolvedValueOnce({});

    renderUserList(adminUser);

    await user.click(await screen.findByRole('button', { name: 'Deletar Pedro Professor' }));

    const modal = screen.getByRole('dialog', {
      name: 'Você deseja remover o usuário "Pedro Professor"?',
    });

    expect(within(modal).getByText('Os seguintes posts serão removidos:')).toBeInTheDocument();
    expect(within(modal).getByText('Introdução à Programação')).toBeInTheDocument();
    expect(within(modal).getByText('História do Brasil')).toBeInTheDocument();

    await user.click(within(modal).getByRole('button', { name: 'Remover' }));

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith('professor-id'));
    expect(screen.queryByText('Pedro Professor')).not.toBeInTheDocument();
    expect(screen.getByText('O usuário foi deletado com sucesso')).toBeInTheDocument();
  });
});
