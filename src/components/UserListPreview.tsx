import styled from 'styled-components';
import type { Role } from '../types/Roles';

import bubbles from '../assets/bubbles.png';
import galaxy from '../assets/galaxy.png';
import userPhoto from '../assets/userPhoto.png';
import { capitalize } from '../utils/functions';

type UserListPreviewProps = {
  role: Role;
};

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Message = styled.p`
  font-weight: 500;
  font-style: Medium;
  font-size: 24px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #021c41;
  width: 250px;
`;

const GalaxyImage = styled.img`
  width: 164.43px;
  angle: 26.48 deg;
  margin-right: auto;
`;

const BubblesImage = styled.img`
  width: 102.12px;
  angle: -65.39 deg;
  margin-left: auto;
`;

const UserListContainer = styled.div`
  padding: 1.813rem 1.188rem;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #f0d2c7;
  border-radius: 7px;
  box-shadow: 0px 1px 4.9px 0px #0000005c;
`;

const UserList = styled.ul`
  list-style: none;
  margin: 10px 0;
  & > *:not(:last-child) {
    border-bottom: 1px solid #f0d2c7;
  }
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.125rem;
`;

const UserProfilePhoto = styled.img`
  width: 1.938rem;
  height: 1.938rem;
  border-radius: 50%;
`;

const UserNameRoleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UserName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const UserRole = styled.p`
  font-size: 14px;
`;

const EditIcon = styled.span`
  color: #a15e6d;
  font-size: 24px;
`;

const DeleteIcon = styled.span`
  color: #e64b63;
  font-size: 24px;
`;

const AccessUserListButton = styled.a`
  color: #32434d;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;

  & * {
    transition: all 0.3s ease;
  }

  & .arrow-icon {
    font-size: 30px;
    color: #efa488;
    margin-left: 0;
  }

  & .sentence {
    font-size: 15px;
  }

  &:hover {
    .sentence {
      color: #b16c9c;
    }
    .arrow-icon {
      margin-left: 10px;
    }
  }
`;

export default function UserListPreview({ role }: UserListPreviewProps) {
  const listaUsers = [
    {
      id: 'c2b58a4e-c4cf-4e20-978c-c1f2793ee18c',
      matricula: '101010',
      nome: 'Francisco',
      role: 'ALUNO',
      foto: userPhoto,
    },
    {
      id: 'c2b58a4e-c4cf-4e20-978c-c1f2793ee18c',
      matricula: '101010',
      nome: 'Maria',
      role: 'ALUNO',
      foto: userPhoto,
    },
    {
      id: 'c2b58a4e-c4cf-4e20-978c-c1f2793ee18c',
      matricula: '101010',
      nome: 'Francisco',
      role: 'ADMIN',
      foto: userPhoto,
    },
    {
      id: 'c2b58a4e-c4cf-4e20-978c-c1f2793ee18c',
      matricula: '202020',
      nome: 'Francisco',
      role: 'PROFESSOR',
      foto: userPhoto,
    },
  ];

  return (
    <>
      {role === 'ALUNO' ? (
        <MessageContainer>
          <GalaxyImage src={galaxy} alt="Desenho de Galáxia" />
          <Message>Transforme o aprendizado em progresso</Message>
          <BubblesImage src={bubbles} alt="Desenho de bolhas" />
        </MessageContainer>
      ) : (
        <UserListContainer>
          <h3>Todos os Usuários</h3>
          <UserList>
            {listaUsers.map((user, i) => (
              <Item key={i}>
                <div>
                  <UserProfilePhoto src={user.foto} alt={`Foto de perfil da ${user.nome}`} />
                </div>
                <UserNameRoleContainer>
                  <UserName>{user.nome}</UserName>
                  <UserRole>
                    {user.role === 'ADMIN' ? 'Administrador' : capitalize(user.role)}
                  </UserRole>
                </UserNameRoleContainer>
                <div>
                  <EditIcon className="material-symbols-outlined">edit</EditIcon>
                  <DeleteIcon className="material-symbols-outlined">delete</DeleteIcon>
                </div>
              </Item>
            ))}
          </UserList>
          <AccessUserListButton href="/user/list">
            <span className="sentence">Acessar lista completa</span>
            <span className="material-symbols-outlined arrow-icon">arrow_right_alt</span>
          </AccessUserListButton>
        </UserListContainer>
      )}
    </>
  );
}
