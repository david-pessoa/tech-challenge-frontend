import styled from 'styled-components';
import logo from '../../public/Logo.png';
import type { Role } from '../types/Roles';
import { capitalize } from '../utils/functions';
import { logout } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;

import HeaderTeach from '../assets/HeaderTeach.png';
import HeaderAdmin from '../assets/HeaderAdmin.png';
import HeaderStudent from '../assets/HeaderStudent.png';

const RoleColors = {
  ADMIN:
    `url(${HeaderAdmin}) center/cover no-repeat`,
  PROFESSOR: 
  `url(${HeaderTeach}) center/cover no-repeat`,
  ALUNO:
    `url(${HeaderStudent}) center/cover no-repeat`,
};

const Background = styled.header<{ $role: Role }>`
  background: ${({ $role }) => RoleColors[$role]};
  width: 100%;
  height: 5.125rem;
  margin-bottom: 4.438rem;
`;

const userCircleColors = {
  ADMIN: {
    background: '#6FB2A7',
    border: '2px solid #A4F3E5',
  },
  PROFESSOR: {
    background: '#FBB3BE',
    border: '2px solid #F7CED2',
  },
  ALUNO: {
    background: '#FDE9A0',
    border: '2px solid #FEF1CE',
  },
};

const Circle = styled.img<{ $role: Role }>`
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background-color: ${({ $role }) => userCircleColors[$role].background};
  border: ${({ $role }) => userCircleColors[$role].border};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const LogoButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin-left: 6.25rem;
  gap: 10px;
`;

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  font-size: 1.5rem;
`;

const LogoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-right: 6.25rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  cursor: pointer;
`;

export default function Header() {
  const navigate = useNavigate();
  const { user } = useUser();

  const roleName = {
    ADMIN: 'Administradores',
    PROFESSOR: 'Professores',
    ALUNO: 'Alunos',
  };

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  

  return (
    user && (
      <Background $role={user.role}>
        <Nav>
          <LogoButton href="/">
            <img src={logo} alt="Edify Logo" width={61} height={57} />
            <Title>Edify {roleName[user.role]}</Title>
          </LogoButton>
          <LogoutContainer>
            <Circle src={BASE_URL + user.image} $role={user.role} />
            <span>{capitalize(user.role)}</span>
            <LogoutButton onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
            </LogoutButton>
          </LogoutContainer>
        </Nav>
      </Background>
    )
  );
}
