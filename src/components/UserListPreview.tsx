import styled from 'styled-components';
import type { Role } from '../types/Roles';

import bubbles from '../assets/bubbles.png';
import galaxy from '../assets/galaxy.png';

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

const UserListContainer = styled.div``;
const UserList = styled.ul``;

export default function UserListPreview({ role }: UserListPreviewProps) {
  const listaUsers = ['oi'];

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
          <UserList>{listaUsers.map((user, i => (
            <li key={i}>
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <p>Nome</p>
                <p>Role</p>
              </div>
              <div>
                <i>Edit</i>
                <i>Remove</i>
              </div>
            </li>

          )))}</UserList>
        </UserListContainer>
      )}
    </>
  );
}
