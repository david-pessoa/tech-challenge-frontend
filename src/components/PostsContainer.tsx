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
import { useScreenWidth } from '../hooks/screenWidth';

const Container = styled.div`
  width: 100%;
  margin-bottom: 3.625rem;
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
`;

const AddIcon = styled.span`
  color: #ee798a;
  font-size: 32px;
`;

export default function PostsContainer() {
  const { user } = useUser();
  const screenWidth = useScreenWidth();

  const creation_date = new Date('2026-08-04');

  const dados = [
    {
      postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
      materia: 'Ciências',
      titulo: 'Aula 20 - Sapos no meio dos humanos',
      descricao: 'Pirâmides etárias',
      autor: 'José',
      createdAt: creation_date,
      editedAt: creation_date,
    },
    {
      postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
      materia: 'História',
      titulo: 'Aula 20 - Sapos no meio dos humanos',
      descricao: 'Pirâmides etárias',
      autor: 'José',
      createdAt: creation_date,
      editedAt: creation_date,
    },
    {
      postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
      materia: 'Português',
      titulo: 'Aula 20 - Sapos no meio dos humanos',
      descricao: 'Pirâmides etárias',
      autor: 'José',
      createdAt: creation_date,
      editedAt: creation_date,
    },
    {
      postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
      materia: 'Matemática',
      titulo: 'Aula 20 - Sapos no meio dos humanos aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      descricao: 'Pirâmides etárias',
      autor: 'José',
      createdAt: creation_date,
      editedAt: creation_date,
    },
    {
      postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
      materia: 'Geografia',
      titulo: 'Aula 20 - Sapos no meio dos humanos',
      descricao: 'Pirâmides etárias',
      autor: 'José',
      createdAt: creation_date,
      editedAt: creation_date,
    },
  ];

  function AlunoContainer() {
    //Obter dados dos posts do back-end

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
          >
            {dados.map((dado: Post, i) => (
              <SwiperSlide key={i} style={{ width: screenWidth >=900 ? '12.5rem' : '9.875rem'}}>
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
          <ViewedPostsTable dados={dados} />
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
            <AddClassButton>
              <AddIcon className="material-symbols-outlined">add</AddIcon>
              <p>Nova aula</p>
            </AddClassButton>
          </AddClassContainer>
          <ProfessorPostsTable dados={dados} />
        </Container>
        <Container>
          <Title>Outras aulas</Title>
          <Paragraph>Aulas criadas por outros professores</Paragraph>
          <ViewedPostsTable dados={dados} />
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
            <AddClassButton>
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
            className="isAdmin"
          >
            {dados.map((dado: Post, i) => (
              <SwiperSlide key={i} style={{ width: screenWidth >=900 ? '12.5rem' : '9.875rem' }}>
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
          <AdminPostsTable dados={dados} />
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
