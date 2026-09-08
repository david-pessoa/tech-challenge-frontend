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
import { useScreenWidth } from '../hooks/screenWidth';

import SearchPostContainerInput from '../components/SearchPostContainerInput';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Main = styled.main`
  padding-left: 6.188rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 18px;
  padding-right: 15px;

  @media (max-width: 1200px) {
    padding-left: 1.25rem;
  }

  @media (max-width: 854px) {
    justify-content: flex-start;
  }
`;

const MainContentContainer = styled.div`
  width: 64.4135vw;

  @media (max-width: 1200px) {
    width: 58.27vw;
  }

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const TopContainer = styled.div`
  display: flex;
  gap: 2.25rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.125rem;
  width: 100%;

  @media (max-width: 1000px) {
    gap: 0;
  }
  @media (max-width: 600px) {
    justify-content: flex-start;
    margin-bottom: 1.125rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 15.688rem;

  @media (max-width: 900px) {
    min-width: 12rem;
    gap: 0;
  }

  @media (max-width: 600px) {
    min-width: 7.7rem;
  }
`;

const SparkleImage = styled.img`
  @media (max-width: 900px) {
    height: 42px;
  }
`;

const Aside = styled.aside`
  @media (max-width: 900px) {
    padding-left: 1.25rem;
  }
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

  @media (max-width: 900px) {
    width: 2.813rem
  }
`;

const ProfileImage = styled.img`
  position: relative;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  width: 8.75rem;

  @media (max-width: 900px) {
    width: 10.125rem;
    margin-top: 0;
  }
  @media (max-width: 600px) {
    width: 5.688rem
  }
`;

const StudentName = styled.h3`
  font-size: 1.25rem;

  @media (max-width: 600px) {
    font-size: 11px;
  }
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
  const screenWidth = useScreenWidth();

  return (
    <>
      <Header />
      {screenWidth <= 900 && (
        <Aside>
          <h1>Perfil</h1>
          <div>
            <Figure>
              <ProfileImageContainer>
                <DoodleImage src={redDoodle} alt="" />
                <ProfileImage
                  src={user?.image ? `${BASE_URL}${user?.image}` : userImage}
                  alt={`Foto de ${user?.nome}`}
                />
              </ProfileImageContainer>
              <Figcaption>
                {user && <StudentName>{user.nome}</StudentName>}
                <p>{capitalize(user?.role ?? 'aluno')}</p>
              </Figcaption>
            </Figure>
          </div>
        </Aside>
      )}
      <Main>
        <MainContentContainer>
          <TopContainer>
            <TitleContainer>
              <h1>Tela Inicial</h1>
              <SparkleImage src={sparkle} alt="Sparkle" />
            </TitleContainer>
            <SearchPostContainerInput />
          </TopContainer>
          <PostsContainer />
        </MainContentContainer>
        {screenWidth > 900 && (
          <Aside>
            <h1>Perfil</h1>
            <div>
              <Figure>
                <ProfileImageContainer>
                  <DoodleImage src={redDoodle} alt="" />
                  <ProfileImage
                    src={user?.image ? `${BASE_URL}${user?.image}` : userImage}
                    alt={`Foto de ${user?.nome}`}
                  />
                </ProfileImageContainer>
                <Figcaption>
                  {user && <StudentName>{user.nome}</StudentName>}
                  <p>{capitalize(user?.role ?? 'aluno')}</p>
                </Figcaption>
              </Figure>
            </div>
            {screenWidth >= 1100 && (
              <div>
                <CalendarTitle>Calendário</CalendarTitle>
                <p>
                  {capitalize(new Date().toLocaleString('pt-BR', { month: 'long' }))}{' '}
                  {new Date().getFullYear()}
                </p>
                {user && <Calendar role={user.role} />}
              </div>
            )}
            {user && screenWidth >= 900 && <UserListPreview role={user.role} />}
          </Aside>
        )}
      </Main>
      {user && screenWidth < 900 && <UserListPreview role={user.role} />}
      <Footer />
    </>
  );
}
