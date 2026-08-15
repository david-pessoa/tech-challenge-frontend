import styled from 'styled-components';
import type { Role } from '../types/Roles';

import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CarouselCard from './CarouselCard';

import 'swiper/css';
import '../styles/swiper-style.css'
import type { Post } from '../types/Posts';

type NewPostsContainerProps = {
  role: Role;
};

const Container = styled.div`
  width: 70vw;
  margin-bottom: 5.688rem;
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

export default function NewPostsContainer({ role }: NewPostsContainerProps) {
  function AlunoContainer() {
    //Obter dados dos posts do back-end

    const creation_date = new Date('2026-08-04');

    const dados = [
      {
        postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
        materia: 'Ciências',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
        materia: 'História',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
        materia: 'Português',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
        materia: 'Matemática',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        postId: '0b70e39b-58ef-4d04-b039-3036a65b0bbe',
        materia: 'Geografia',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
    ];

    return (
      <Container>
        <Title>Novas Aulas</Title>
        <Paragraph>Últimas postagens de aulas feitas pelos seus professores</Paragraph>
        <Swiper
          modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={12}
          slidesPerView={4}
          loop={true}
          pagination={{ clickable: true }}
          navigation
          onSlideChange={() => console.log('slide change')}
          onSwiper={swiper => console.log(swiper)}
        >
          {dados.map((dado: Post, i) => (
            <SwiperSlide key={i}>
              <Link href={`/post/${dado.postId}`}>
                <CarouselCard dado={dado} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    );
  }
  function ProfessorContainer() {
    return <></>;
  }
  function AdminContainer() {
    return <></>;
  }

  return (
    <div>
      {role === 'PROFESSOR' ? (
        <ProfessorContainer />
      ) : role === 'ALUNO' ? (
        <AlunoContainer />
      ) : (
        <AdminContainer />
      )}
    </div>
  );
}
