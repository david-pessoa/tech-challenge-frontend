import styled from 'styled-components';

import Carousel from './Carousel';
import ViewedPostsTable from './ViewedPostsTable';
import ManagementPostsTable from './ManagementPostsTable';
import { useNavigate } from 'react-router-dom';

import 'swiper/css';
import '../styles/swiper-style.css';
import type { Post } from '../types/Posts';
import { useUser } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getAllPosts } from '../services/post.service';

const Container = styled.div`
  width: 100%;
  margin-bottom: 3.625rem;

  @media (max-width: 900px) {
    margin-bottom: 2.188rem
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;

  @media (max-width: 900px) {
    margin-bottom: 2px;
  }
`;

const Paragraph = styled.p`
  margin-bottom: 1.813rem;

  @media (max-width: 900px) {
    margin-bottom: 1.563rem;
  }
  @media (max-width: 900px) {
    margin-bottom: 1.563rem;
  }
`;

const AddClassContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin-bottom: 1.813rem;

  @media (max-width: 900px) {
    margin-bottom: 1rem;
  }
`;

const AddClassButton = styled.button`
  height: 100%;
  width: 6.938rem;
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: opacity 0.2s;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
    
  @media (max-width: 600px) {
    width: 4.75rem;
  }
`;

const AddIcon = styled.span`
  color: #ee798a;
  font-size: 32px;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

export default function PostsContainer() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function returnAllPosts() {
      try {
        const postsList = await getAllPosts();
        setPosts(postsList);
      } catch (error) {
        setPosts([]);
      }
      setIsLoading(false);
    }
    returnAllPosts();
  }, []);

  function AlunoContainer() {
    const viewedPosts = posts.filter(p => p.foiVisto != false)
    const newPosts = posts.filter(p => p.foiVisto != true)

    return (
      <>
        <Container>
          <Title>Novas Aulas</Title>
          <Paragraph>Últimas postagens de aulas feitas pelos seus professores</Paragraph>
          {isLoading ? (<Paragraph>Carregando aulas...</Paragraph>): <Carousel newPosts={newPosts} isAdmin={false}/>}
        </Container>
        <Container>
          <Title>Aulas Finalizadas</Title>
          <Paragraph>Você já finalizou estas atividades</Paragraph>
          <ViewedPostsTable dados={isLoading ? [] : viewedPosts} />
        </Container>
      </>
    );
  }
  
  function TeacherContainer() {
    const myPosts = posts.filter(p => p.criadoPor?.userId === user?.id)
    const otherPosts = posts.filter(p => p.criadoPor?.userId !== user?.id)

    return (
      <>
        <Container>
          <Title>Suas aulas</Title>
          <AddClassContainer>
            <Paragraph>Veja as aulas que você postou</Paragraph>
            <AddClassButton onClick={() => navigate('/post/new')}>
              <AddIcon className="material-symbols-outlined">add</AddIcon>
              <p>Nova aula</p>
            </AddClassButton>
          </AddClassContainer>
          {isLoading ? (
            <Paragraph>Carregando aulas...</Paragraph>
          ) : (
            <ManagementPostsTable dados={myPosts} />
          )}
        </Container>
        <Container>
          <Title>Outras aulas</Title>
          <Paragraph>Aulas criadas por outros professores</Paragraph>
          {isLoading ? (
            <Paragraph>Carregando aulas...</Paragraph>
          ) : (
            <ViewedPostsTable dados={otherPosts} />
          )}
        </Container>
      </>
    );
  }

  function AdminContainer() {
    const newPosts = posts.filter(p => p.foiVisto != true)

    return (
      <>
        <Container>
          <Title>Novas aulas</Title>
          <AddClassContainer>
            <Paragraph>Últimas postagens de aulas feitas pelos professores</Paragraph>
            <AddClassButton onClick={() => navigate('/post/new')}>
              <AddIcon className="material-symbols-outlined">add</AddIcon>
              <p>Nova aula</p>
            </AddClassButton>
          </AddClassContainer>
          {isLoading ? (<Paragraph>Carregando aulas...</Paragraph>): <Carousel newPosts={newPosts} isAdmin={true}/>}
        </Container>
        <Container>
          <Title>Acervo da Escola</Title>
          <Paragraph>Todas as aulas postadas</Paragraph>
          <ManagementPostsTable dados={isLoading ? [] : posts} />
        </Container>
      </>
    );
  }

  return (
    user && (
      <div>
        {user.role === 'PROFESSOR' ? (
          <TeacherContainer />
        ) : user.role === 'ALUNO' ? (
          <AlunoContainer />
        ) : (
          <AdminContainer />
        )}
      </div>
    )
  );
}