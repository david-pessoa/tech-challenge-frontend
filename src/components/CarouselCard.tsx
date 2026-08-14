import styled from 'styled-components';

import type { Post } from '../types/Posts';

type CardProps = {
  $backgroundColor: string;
  $color: string;
  $icon: string;
};

const Card = styled.div<CardProps>`
  height: 15.188rem;
  width: 12.5rem;
  border-radius: 20px 0 20px 0;
  background: #fff6d740;
  box-shadow: 2px 2px 4px 0px #0000001a;
`;

const IconContainer = styled.figure<CardProps>`
  height: 7.688rem;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px 0 0 0;
  gap: 5px;
`;

const Icon = styled.span`
  font-size: 56px;
`;

const MateriaTitle = styled.h3<CardProps>`
  font-size: 22px;
  color: ${({ $color }) => $color};
  font-weight: 600;
`;

const DescriptionContainer = styled.figcaption<CardProps>`
  padding-left: 6px;
  padding-top: 8px;
  box-sizing: border-box;
`;

const MateriaSubTitle = styled.h4<CardProps>`
  font-size: 12px;
  font-weight: 400;
  color: ${({ $color }) => $color};
  margin-bottom: 10px;
`;

const PostTitle = styled.h5`
  font-size: 1rem;
  margin-bottom: 5px;
`;

type CarouselCardProps = {
  dado: Post;
};

export default function CarouselCard({ dado }: CarouselCardProps) {
  const materias = {
    Ciências: {
      backgroundColor: '#A4CDC6',
      color: '#287C6D',
      icon: 'microbiology',
    },
    História: {
      backgroundColor: '#E0A7E3',
      color: '#902995',
      icon: 'account_balance',
    },
    Português: {
      backgroundColor: '#FCBBA3',
      color: '#AE4E2B',
      icon: 'menu_book',
    },
    Matemática: {
      backgroundColor: '#A7CEE3',
      color: '#1D648A',
      icon: 'function',
    },
    Geografia: {
      backgroundColor: '#F3CE99',
      color: '#9D6719',
      icon: 'globe',
    },
  };

  const materia = materias[dado.materia];

  return (
    <Card $backgroundColor={materia.backgroundColor} $color={materia.color}>
      <IconContainer $backgroundColor={materia.backgroundColor}>
        <Icon className="material-symbols-outlined">{materia.icon}</Icon>
        <MateriaTitle $color={materia.color}>{dado.materia}</MateriaTitle>
      </IconContainer>
      <DescriptionContainer>
        <MateriaSubTitle $color={materia.color}>{dado.materia}</MateriaSubTitle>
        <PostTitle>{dado.titulo}</PostTitle>
        <p>
          Publicado em {new Intl.DateTimeFormat('pt-BR').format(dado.createdAt)} por {dado.autor}
        </p>
      </DescriptionContainer>
    </Card>
  );
}
