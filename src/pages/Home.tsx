import Header from '../components/Header';
import Footer from '../components/Footer';
import PostsContainer from '../components/PostsContainer';

import sparkle from '../assets/sparkle.png';
import redDoodle from '../assets/red-doodle.png';

import styled from 'styled-components';
import { useUser } from '../context/AuthContext';

import userImage from '../assets/user-default-image.png';

import { capitalize } from '../utils/functions';
import Calendar from '../components/Calendar';
import UserListPreview from '../components/UserListPreview';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Main = styled.main`
  margin-left: 6.188rem;
  display: flex;
`;

const TopContainer = styled.div`
  display: flex;
  gap: 2.25rem;
  align-items: center;
  margin-bottom: 2.125rem;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InputContainer = styled.div`
  background-color: #fde9a06b;
  border-radius: 20px;
  height: 2.625rem;
  width: 40.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 19px;
  box-sizing: border-box;
`;

const InputSearch = styled.input`
  border: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const Aside = styled.aside`
  margin-left: 20px;
  width: 23.459vw;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DoodleImage = styled.img`
  width: 84.28px;
  position: absolute;
  top: 180px;
  right: 130px;
`;

const ProfileImage = styled.img`
  position: relative;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  width: 8.75rem;
  margin-top: 20px;
`;

const StudentName = styled.h3`
  font-size: 1.25rem;
`;

const Figcaption = styled.figcaption`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
  gap: 5px;
`;

const Figure = styled.figure`
  margin-bottom: 20px;
`;

const CalendarTitle = styled.h2`
  margin-bottom: 8px;
`;

export default function Home() {
  document.title = 'Edify | Home';
  const { user } = useUser();

  return (
    <>
      <Header />
      <Main>
        <div>
          <TopContainer>
            <TitleContainer>
              <h1>Tela Inicial</h1>
              <img src={sparkle} alt="Sparkle" />
            </TitleContainer>
            <InputContainer>
              <InputSearch type="text" placeholder="Pesquise aqui..." />
              <span className="material-symbols-outlined">search</span>
            </InputContainer>
          </TopContainer>
          <PostsContainer />
        </div>
        <Aside>
          <h1>Perfil</h1>
          <div>
            <Figure>
              <ProfileImageContainer>
                <DoodleImage src={redDoodle} alt="" />
                <ProfileImage src={user?.image ? `${BASE_URL}${user?.image}` : userImage} alt={`Foto de ${user?.nome}`} />
              </ProfileImageContainer>
              <Figcaption>
                {user && <StudentName>{user.nome}</StudentName>}
                <p>{capitalize(user?.role ?? 'aluno')}</p>
              </Figcaption>
            </Figure>
          </div>
          <div>
            <CalendarTitle>Calendário</CalendarTitle>
            <p>
              {capitalize(new Date().toLocaleString('pt-BR', { month: 'long' }))}{' '}
              {new Date().getFullYear()}
            </p>
            {user && <Calendar role={user.role} />}
          </div>
          {user && <UserListPreview role={user.role} />}
        </Aside>
      </Main>
      <Footer />
    </>
  );
}
