import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { deleteUser, getAllUsers } from '../services/user.service';
import type { Role } from '../types/Roles';
import type { User } from '../types/User';
import { buildApiImageUrl } from '../utils/functions';
import userImage from '../assets/user-default-image.png';

const USER_GROUPS: { title: string; role: Role }[] = [
  { title: 'Administradores', role: 'ADMIN' },
  { title: 'Professores', role: 'PROFESSOR' },
  { title: 'Alunos', role: 'ALUNO' },
];

const Main = styled.main`
  margin: 0 auto 4rem;
  width: min(72rem, calc(100% - 2rem));
`;

const HeaderRow = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  color: #32434d;
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 1;
  margin: 0 0 0.5rem;
`;

const HeaderLink = styled.a`
  align-items: center;
  color: #3a505d;
  display: inline-flex;
  font-size: 1rem;
  font-weight: 400;
  gap: 0.375rem;
  line-height: 1;
  text-decoration: none;
`;

const BackIcon = styled.span`
  color: #f58ca3;
  font-size: 1.125rem;
  font-variation-settings: 'FILL' 1;
  line-height: 1;
  transform: rotate(-90deg);
`;

const AddIcon = styled.span`
  color: #e64b63;
  font-size: 1.125rem;
  font-variation-settings: 'FILL' 0;
  line-height: 1;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 1rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const Th = styled.th`
  background: #efa488;
  color: #fffcf2;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1;
  padding: 0.75rem;
  text-align: left;
`;

const Td = styled.td`
  background: #fffbeb;
  border-bottom: 1px solid #eee;
  color: #32434d;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  padding: 0.75rem;
  text-align: left;
`;

const CenteredTd = styled(Td)`
  text-align: center;
`;

const PhotoCell = styled(Td)`
  width: 4.5rem;
`;

const UserPhoto = styled.img`
  border-radius: 50%;
  display: block;
  height: 2.75rem;
  object-fit: cover;
  width: 2.75rem;
`;

const UserName = styled.strong`
  display: block;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionLink = styled.a`
  color: #a15e6d;
  display: grid;
  height: 2rem;
  place-items: center;
  text-decoration: none;
  width: 2rem;
`;

const ActionButton = styled.button`
  border: 0;
  background: transparent;
  color: #e64b63;
  cursor: pointer;
  display: grid;
  height: 2rem;
  place-items: center;
  padding: 0;
  width: 2rem;
`;

const ActionIcon = styled.span`
  font-size: 1.125rem;
  font-variation-settings: 'FILL' 0;
  line-height: 1;
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
            <HeaderLink href="/">
              <BackIcon className="material-symbols-outlined">arrow_upward</BackIcon>
              Voltar a tela de início
            </HeaderLink>
          </div>

          <HeaderLink href="/user/new">
            <AddIcon className="material-symbols-outlined">add</AddIcon>
            Novo Usuário
          </HeaderLink>
        </HeaderRow>

        {message && <Message>{message}</Message>}

        {USER_GROUPS.map(group => (
          <Section key={group.role}>
            <SectionTitle>{group.title}</SectionTitle>

            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Foto</Th>
                    <Th>Nome completo</Th>
                    <Th>Data de nascimento</Th>
                    <Th>Matrícula</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => user.role === group.role)
                    .map(user => (
                      <tr key={user.id}>
                        <PhotoCell>
                          <UserPhoto
                            src={user.image ? buildApiImageUrl(user.image) : userImage}
                            alt={`Foto de ${user.nome}`}
                            onError={event => {
                              event.currentTarget.src = userImage;
                            }}
                          />
                        </PhotoCell>
                        <Td>
                          <UserName>{user.nome}</UserName>
                        </Td>
                        <CenteredTd>{formatBirthDate(user.birthDate)}</CenteredTd>
                        <Td>{user.matricula}</Td>
                        <CenteredTd>
                          <Actions>
                            <ActionLink href={`/user/edit/${user.id}`} aria-label={`Editar ${user.nome}`}>
                              <ActionIcon className="material-symbols-outlined">edit</ActionIcon>
                            </ActionLink>
                            <ActionButton
                              type="button"
                              onClick={() => handleDeleteUser(user.id)}
                              aria-label={`Deletar ${user.nome}`}
                            >
                              <ActionIcon className="material-symbols-outlined">delete</ActionIcon>
                            </ActionButton>
                          </Actions>
                        </CenteredTd>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </TableWrapper>
          </Section>
        ))}
      </Main>

      <Footer />
    </>
  );
}
