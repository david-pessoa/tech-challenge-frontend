import styled from 'styled-components';
import type { Role } from '../types/Roles';

import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CarouselCard from './CarouselCard';

import 'swiper/css';
import type { Post } from '../types/Posts';

type NewPostsContainerProps = {
  role: Role;
};

const Title = styled.h2`
  margin-bottom: 10px;
`;

export default function NewPostsContainer({ role }: NewPostsContainerProps) {
  function AlunoContainer() {
    //Obter dados dos posts do back-end

    const creation_date = new Date('2026-08-04');

    const dados = [
      {
        materia: 'Ciências',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        materia: 'Ciências',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        materia: 'Ciências',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        materia: 'Ciências',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
      {
        materia: 'Ciências',
        titulo: 'Aula 20 - Sapos no meio dos humanos',
        autor: 'José',
        createdAt: creation_date,
      },
    ];

    return (
      <>
        <Title>Novas Aulas</Title>
        <p>Últimas postagens de aulas feitas pelos seus professores</p>
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
              <CarouselCard dado={dado} />
            </SwiperSlide>
          ))}
        </Swiper>
      </>
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
