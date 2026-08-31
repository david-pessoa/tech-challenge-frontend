import styled from 'styled-components';
import type { Role } from '../types/Roles';

import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CarouselCard from './CarouselCard';
import ViewedPostsTable from './ViewedPostsTable';

import 'swiper/css';
import '../styles/swiper-style.css';
import type { Post } from '../types/Posts';
import ProfessorPostsTable from './ProfessorPostsTable';
import AdminPostsTable from './AdminPostsTable';
import { useUser } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getAllPosts } from '../services/post.service';

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
  display: block;
`;

const AddClassContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin-bottom: 1.813rem;
`;

const AddClassButton = styled.a`
  height: 100%;
  width: 6.938rem;
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddIcon = styled.span`
  color: #ee798a;
  font-size: 32px;
`;

export default function PostsContainer() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function returnAllPosts() {
      try {
        const postsList = await getAllPosts();
        setPosts(postsList);
      } catch (error) {
        setPosts([]);
      }
    }
    returnAllPosts();
  }, []);

  function AlunoContainer() {
    
    // Os posts já visualizados são exibidos na tabela
    const viewedPosts = posts.filter(p => p.foiVisto != false)
    // Obtém os posts não vistos e exibe no carrossel
    const newPosts = posts.filter(p => p.foiVisto != true)

    return (
      <>
        <Container>
          <Title>Novas Aulas</Title>
          <Paragraph>Últimas postagens de aulas feitas pelos seus professores</Paragraph>
          <Swiper
            modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={12}
            slidesPerView="auto"
            loop={true}
            pagination={{ clickable: true }}
            navigation
            onSwiper={swiper => console.log(swiper)}
          >
            {newPosts.map((dado: Post, i) => (
              <SwiperSlide key={i} style={{ width: '12.5rem' }}>
                <Link href={`/post/${dado.postId}`}>
                  <CarouselCard dado={dado} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
        <Container>
          <Title>Aulas Finalizadas</Title>
          <Paragraph>Você já finalizou estas atividades</Paragraph>
          <ViewedPostsTable dados={viewedPosts} />
        </Container>
      </>
    );
  }
  function ProfessorContainer() {
    return (
      <>
        <Container>
          <Title>Suas aulas</Title>
          <AddClassContainer>
            <Paragraph>Veja as aulas que você postou</Paragraph>
            <AddClassButton href='/post/new'>
              <AddIcon className="material-symbols-outlined">add</AddIcon>
              <p>Nova aula</p>
            </AddClassButton>
          </AddClassContainer>
          <ProfessorPostsTable dados={posts} />
        </Container>
        <Container>
          <Title>Outras aulas</Title>
          <Paragraph>Aulas criadas por outros professores</Paragraph>
          <ViewedPostsTable dados={posts} />
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
            <AddClassButton href='/post/new'>
              <AddIcon className="material-symbols-outlined">add</AddIcon>
              <p>Nova aula</p>
            </AddClassButton>
          </AddClassContainer>
          <Swiper
            modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={12}
            slidesPerView="auto"
            loop={true}
            pagination={{ clickable: true }}
            navigation
            onSwiper={swiper => console.log(swiper)}
            className="isAdmin"
          >
            {posts.map((dado: Post, i) => (
              <SwiperSlide key={i} style={{ width: '12.5rem' }}>
                <Link href={`/post/${dado.postId}`}>
                  <CarouselCard dado={dado} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
        <Container>
          <Title>Acervo da Escola</Title>
          <Paragraph>Todas as aulas postadas</Paragraph>
          <AdminPostsTable dados={posts} />
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
