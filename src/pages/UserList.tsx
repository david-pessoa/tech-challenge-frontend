import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { deleteUser, getAllUsers } from '../services/user.service';
import type { User } from '../types/User';
import { capitalize } from '../utils/functions';

const Main = styled.main`
  margin: 0 auto 4rem;
  width: min(72rem, calc(100% - 2rem));
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
`;

const BackLink = styled.a`
  text-decoration: none;
`;

const NewUserLink = styled.a`
  text-decoration: none;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const Th = styled.th`
  border-bottom: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid #eee;
  padding: 0.75rem;
`;

const UserName = styled.strong`
  display: block;
`;

const UserRole = styled.span`
  display: block;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const ActionButton = styled.button`
  border: 0;
  background: transparent;
  color: #e64b63;
  cursor: pointer;
  padding: 0;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.primary};
`;

function formatBirthDate(birthDate?: Date | string | null) {
  if (!birthDate) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(birthDate));
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = 'Edify | Lista de Usuários';

    async function loadUsers() {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar usuários.';
        setMessage(message);
      }
    }

    loadUsers();
  }, []);

  async function handleDeleteUser(id: string) {
    try {
      await deleteUser(id);
      setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
      setMessage('Usuário deletado com sucesso.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar usuário.';
      setMessage(message);
    }
  }

  return (
    <>
      <Header />

      <Main>
        <HeaderRow>
          <div>
            <Title>Lista completa</Title>
            <BackLink href="/">Voltar a tela de início</BackLink>
          </div>

          <NewUserLink href="/user/new">Novo Usuário</NewUserLink>
        </HeaderRow>

        {message && <Message>{message}</Message>}

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Nome completo</Th>
                <Th>Data de nascimento</Th>
                <Th>Matrícula</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <Td>
                    <UserName>{user.nome}</UserName>
                    <UserRole>
                      {user.role === 'ADMIN' ? 'Administrador' : capitalize(user.role)}
                    </UserRole>
                  </Td>
                  <Td>{formatBirthDate(user.birthDate)}</Td>
                  <Td>{user.matricula}</Td>
                  <Td>
                    <Actions>
                      <ActionLink href={`/user/edit/${user.id}`}>
                        Editar
                      </ActionLink>
                      <ActionButton
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Deletar
                      </ActionButton>
                    </Actions>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Main>

      <Footer />
    </>
  );
}
