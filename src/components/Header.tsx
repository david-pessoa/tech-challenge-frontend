import styled from 'styled-components';
import logo from '../../public/Logo.png';
import type { Role } from '../types/Roles';
import { logout } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/AuthContext';
import userImage from '../assets/user-default-image.png';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const RoleColors = {
  ADMIN:
    'radial-gradient(111.63% 111.63% at 42.64% -5.82%, #E3FCF8 33.65%, #BFDCD7 44.58%, #A4CDC6 100%);',
  PROFESSOR:
    'radial-gradient(111.63% 111.63% at 42.64% -5.82%, #FEE4DF 33.65%, rgba(251, 179, 190, 0.71) 44.58%, rgba(224, 167, 227, 0.71) 100%)',
  ALUNO:
    'radial-gradient(111.63% 111.63% at 42.64% -5.82%, #FDE9A0 33.65%, #FCBBA3 44.58%, #FCBBA3 100%)',
};

const Background = styled.header<{ $role: Role }>`
  background: ${({ $role }) => RoleColors[$role]};
  width: 100%;
  height: 5.125rem;
  margin-bottom: 4.438rem;

  @media (max-width: 500px) {
    height: 2.75rem;
  }
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

  @media (max-width: 500px) {
    width: 18px;
    height: 18px;
  }
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

  @media (max-width: 834px) {
    margin-left: 1.25rem;
  }
`;

const LogoImage = styled.img`
  width: 61px;
  height: 57px;

  @media (max-width: 500px) {
    height: 1.125rem;
    width: 1.25rem;
  }
`;

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  font-size: 1.5rem;

  @media (max-width: 500px) {
    font-size: 10px;
  }
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;


  @media (max-width: 500px) {
    font-size: 12px;
  }
`;

const LogoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-right: 6.25rem;

  @media (max-width: 834px) {
    margin-right: 1.25rem;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  cursor: pointer;
`;

const LogoutIcon = styled.span`
  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

export default function Header() {
  const navigate = useNavigate();
  const { user, refreshUser } = useUser();

  const roleName = {
    ADMIN: 'Administradores',
    PROFESSOR: 'Professores',
    ALUNO: 'Alunos',
  };

  async function handleLogout() {
    logout();
    await refreshUser();
    navigate('/login');
  }

  return (
    user && (
      <Background $role={user.role}>
        <Nav>
          <LogoButton href="/">
            <LogoImage src={logo} alt="Edify Logo" />
            <Title>Edify {roleName[user.role]}</Title>
          </LogoButton>
          <LogoutContainer>
            <Circle src={user.image ? BASE_URL + user.image : userImage} $role={user.role} />
            <UserName>{user.nome}</UserName>
            <LogoutButton onClick={handleLogout}>
              <LogoutIcon className="material-symbols-outlined">logout</LogoutIcon>
            </LogoutButton>
          </LogoutContainer>
        </Nav>
      </Background>
    )
  );
}
