import styled from 'styled-components';
import logo from '../../public/Logo.png';
import type { Role } from '../types/Roles';
import { capitalize } from '../utils/functions';

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

const Circle = styled.div<{ $role: Role }>`
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
`;

type HeaderProps = {
  role: Role;
};

export default function Header({ role }: HeaderProps) {
  const roleName = {
    ADMIN: 'Administradores',
    PROFESSOR: 'Professores',
    ALUNO: 'Alunos',
  };

  

  return (
    <Background $role={role}>
      <Nav>
        <LogoButton href="/">
          <img src={logo} alt="Edify Logo" width={61} height={57} />
          <Title>Edify {roleName[role]}</Title>
        </LogoButton>
        <LogoutContainer>
          <Circle $role={role} />
          <span>{capitalize(role)}</span>
          <LogoutButton>
            <span className="material-symbols-outlined">logout</span>
          </LogoutButton>
        </LogoutContainer>
      </Nav>
    </Background>
  );
}
