import Header from '../components/Header';
import Footer from '../components/Footer';
import NewPostsContainer from '../components/NewPostsContainer';

import sparkle from '../assets/sparkle.png';

import styled from 'styled-components';
import type { Role } from '../types/Roles';

const Main = styled.main`
  margin-left: 6.188rem;
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

export default function Home() {
  document.title = 'Edify | Home';

  // Fazer lógica para obter informações do usuário do back-end

  const role: Role = 'ALUNO';

  return (
    <>
      <Header role={role} />
      <Main>
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
        <NewPostsContainer role={role} />
        <aside></aside>
      </Main>
      <Footer />
    </>
  );
}
