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
import { useEffect, useState } from 'react';
import { searchPost } from '../services/post.service';
import type { Post } from '../types/Posts';
import { useDebounce } from '../hooks/debounce';

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
  position: relative;
  background-color: #fde9a06b;
  border-radius: 20px;
  min-height: 2.625rem;
  width: 40.5rem;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
`;

const InnerInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;

const ResultsList = styled.ul`
  position: absolute;
  width: 100%;
  padding: 15px;
  left: 0;
  top: calc(70%);
  box-sizing: border-box;
  z-index: 100;
  list-style: none;
  margin-top: 5px;
  background-color: #fef4d0;
  border-radius: 0 0 20px 20px;
`;

const ListItemLink = styled.a`
  display: flex;
  margin-top: 10px;
  align-items: center;
  gap: 2.5rem;
  color: inherit;
  text-decoration: none;
  height: 2rem;
  border-radius: 15px;

  &:hover {
    background-color: #fbbba3;
  }

  &:active {
    background-color: #e0a7e3;
  }
`;

const ListItem = styled.li`
  display: flex;
  gap: 2.5rem;
  margin-left: 10px;
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
  const [searchedPostsList, setSearchedPostsList] = useState<Post[]>([]);
  const [searchedText, setSearchedText] = useState('');
  const [hideSearchResults, setHideSearchResults] = useState(true);
  const debouncedQuery = useDebounce(searchedText, 300);

  async function handleInputChange() {
    // setSearchedText(e.target.value);
    if (searchedText === '') {
      setSearchedPostsList([]);
      return;
    }
    try {
      const relatedPosts = await searchPost(searchedText);
      setSearchedPostsList(relatedPosts);
    } catch (error) {
      setSearchedPostsList([]);
    }
  }

  useEffect(() => {
    if (debouncedQuery) {
      handleInputChange();
    }
  }, [debouncedQuery]);

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
            <InputContainer onClick={() => setHideSearchResults(false)}>
              <InnerInputContainer>
                <InputSearch
                  type="text"
                  placeholder="Pesquise aqui..."
                  value={searchedText}
                  onChange={e => setSearchedText(e.target.value)}
                  onBlur={() => setHideSearchResults(true)}
                />
                <span className="material-symbols-outlined">search</span>
              </InnerInputContainer>
              <ResultsList hidden={hideSearchResults}>
                {searchedPostsList.map((post, i) => (
                  <ListItemLink href={`/post/${post.postId}`} target="_blank">
                    <ListItem key={i}>
                      <p>{post.titulo}</p>
                      <p>{post.descricao}</p>
                    </ListItem>
                  </ListItemLink>
                ))}
              </ResultsList>
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
