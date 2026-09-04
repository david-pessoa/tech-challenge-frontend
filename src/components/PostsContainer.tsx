import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../services/post.service';

import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CarouselCard from './CarouselCard';
import ViewedPostsTable from './ViewedPostsTable';
import ProfessorPostsTable from './ProfessorPostsTable';
import AdminPostsTable from './AdminPostsTable';

import 'swiper/css';
import '../styles/swiper-style.css';
import type { Post } from '../types/Posts';
import { useUser } from '../context/AuthContext';


const Container = styled.div`
  width: 64.4135vw;
  margin-bottom: 3.625rem;
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  margin-bottom: 1.813rem;
`;

const Link = styled.a`
  color: inherit;
  text-decoration: none;
  display: block;
`;

const AddClassContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin-bottom: 1.813rem;
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

  &:hover {
    opacity: 0.7;
  }
`;

const AddIcon = styled.span`
  color: #ee798a;
  font-size: 32px;
`;

export default function PostsContainer() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [apiPosts, setApiPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then((data) => {
        setApiPosts(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar posts:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handlePostDeleted = (deletedId: string) => {
    setApiPosts((prevPosts) => prevPosts.filter((post) => post.postId !== deletedId));
  };

  function AlunoContainer() {
    return (
      <>
        <Container>
          <Title>Novas Aulas</Title>
          <Paragraph>Últimas postagens de aulas feitas pelos seus professores</Paragraph>
          
          {isLoading ? (
            <Paragraph>Carregando aulas...</Paragraph>
          ) : (
            <Swiper
              modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={12}
              slidesPerView="auto"
              loop={false} 
              pagination={{ clickable: true }}
              navigation
            >
              {apiPosts.map((dado: Post) => (
                <SwiperSlide key={dado.postId} style={{ width: '12.5rem' }}>
                  <Link href={`/post/${dado.postId}`}>
                    <CarouselCard dado={dado} />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Container>
        <Container>
          <Title>Aulas Finalizadas</Title>
          <Paragraph>Você já finalizou estas atividades</Paragraph>
          <ViewedPostsTable dados={isLoading ? [] : apiPosts} />
        </Container>
      </>
    );
  }

 function ProfessorContainer() {
    const minhasAulas = apiPosts.filter((post) => post.autor === user?.nome);
    const outrasAulas = apiPosts.filter((post) => post.autor !== user?.nome);

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
            <ProfessorPostsTable dados={minhasAulas} />
          )}
        </Container>
        <Container>
          <Title>Outras aulas</Title>
          <Paragraph>Aulas criadas por outros professores</Paragraph>
          {isLoading ? (
            <Paragraph>Carregando aulas...</Paragraph>
          ) : (
            <ViewedPostsTable dados={outrasAulas} />
          )}
        </Container>
      </>
    );
  }

  function AdminContainer() {
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

          {isLoading ? (
            <Paragraph>Carregando aulas...</Paragraph>
          ) : (
            <Swiper
              modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={12}
              slidesPerView="auto"
              loop={false}
              pagination={{ clickable: true }}
              navigation
              className='isAdmin'
            >
              {apiPosts.map((dado: Post) => (
                <SwiperSlide key={dado.postId} style={{ width: '12.5rem' }}>
                  <Link href={`/post/${dado.postId}`}>
                    <CarouselCard dado={dado} />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Container>
        <Container>
          <Title>Acervo da Escola</Title>
          <Paragraph>Todas as aulas postadas</Paragraph>
          <AdminPostsTable
            dados={isLoading ? [] : apiPosts}
            onDeleteSuccess={handlePostDeleted}
          />
        </Container>
      </>
    );
  }

  return (
    user && (
      <div>
        {user.role === 'PROFESSOR' ? (
          <ProfessorContainer />
        ) : user.role === 'ALUNO' ? (
          <AlunoContainer />
        ) : (
          <AdminContainer />
        )}
      </div>
    )
  );
}