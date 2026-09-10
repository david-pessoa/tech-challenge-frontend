import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Home from '../Home';
import { renderWithProviders } from '../../tests/test-utils';
import { getAllPosts } from '../../services/post.service';
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

const studentUser: User = {
  id: 'student-id',
  nome: 'Maria',
  matricula: '123456',
  role: 'ALUNO',
  image: '',
};

vi.mock('../../services/post.service', () => ({
  getAllPosts: vi.fn(),
}));

vi.mock('../../hooks/screenWidth', () => ({
  useScreenWidth: () => 1200,
}));

vi.mock('../../components/Header', () => ({
  default: () => <header>Header</header>,
}));

vi.mock('../../components/Footer', () => ({
  default: () => <footer>Footer</footer>,
}));

vi.mock('../../components/SearchPostContainerInput', () => ({
  default: () => <div>Busca</div>,
}));

vi.mock('../../components/Calendar', () => ({
  default: () => <div>Calendário</div>,
}));

vi.mock('../../components/UserListPreview', () => ({
  default: () => <div>Prévia de usuários</div>,
}));

vi.mock('../../components/Carousel', () => ({
  default: () => <div>Carrossel</div>,
}));

vi.mock('../../components/ViewedPostsTable', () => ({
  default: () => <div>Tabela de aulas visualizadas</div>,
}));

vi.mock('../../components/ManagementPostsTable', () => ({
  default: () => <div>Tabela de gerenciamento</div>,
}));

function renderHome(user: User) {
  return renderWithProviders(<Home />, { user });
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAllPosts).mockResolvedValue([]);
  });

  it('deve apresentar a home de administrador quando usuário logado for admin', async () => {
    renderHome(adminUser);

    await waitFor(() => expect(getAllPosts).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Novas aulas')).toBeInTheDocument();
    expect(screen.getByText('Acervo da Escola')).toBeInTheDocument();
    expect(screen.queryByText('Suas aulas')).not.toBeInTheDocument();
    expect(screen.queryByText('Aulas Finalizadas')).not.toBeInTheDocument();
  });

  it('deve apresentar a home de professor quando usuário logado for professor', async () => {
    renderHome(professorUser);

    await waitFor(() => expect(getAllPosts).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Suas aulas')).toBeInTheDocument();
    expect(screen.getByText('Outras aulas')).toBeInTheDocument();
    expect(screen.queryByText('Acervo da Escola')).not.toBeInTheDocument();
    expect(screen.queryByText('Aulas Finalizadas')).not.toBeInTheDocument();
  });

  it('deve apresentar a home de aluno quando usuário logado for aluno', async () => {
    renderHome(studentUser);

    await waitFor(() => expect(getAllPosts).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Novas Aulas')).toBeInTheDocument();
    expect(screen.getByText('Aulas Finalizadas')).toBeInTheDocument();
    expect(screen.queryByText('Suas aulas')).not.toBeInTheDocument();
    expect(screen.queryByText('Acervo da Escola')).not.toBeInTheDocument();
  });
});
