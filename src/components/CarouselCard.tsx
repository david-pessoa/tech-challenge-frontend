import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';

const Card = styled.div`
  height: 15.188rem;
  width: 12.5rem;
  border-radius: 20px 0 20px 0;
  background: #fff6d740;
  box-shadow: 2px 2px 4px 0px #0000001a;

  @media (max-width: 900px) {
    width: 9.875rem;
    height: 13.438rem;
  }
`;

type BackgroundProps = {
  $backgroundColor: string;
};

const IconContainer = styled.figure<BackgroundProps>`
  height: 7.688rem;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px 0 0 0;
  gap: 5px;

  @media (max-width: 900px) {
    height: 5.813rem;
    gap: 1rem;
  }
`;

type ColorProps = {
  $color: string;
};

const Icon = styled.span<ColorProps>`
  font-size: 56px;
  color: ${({ $color }) => $color};

  @media (max-width: 900px) {
    height: 40px;
  }
`;

const MateriaTitle = styled.h3<ColorProps>`
  font-size: 22px;
  color: ${({ $color }) => $color};
  font-weight: 600;

  @media (max-width: 900px) {
    font-size: 15px
  }
`;

const DescriptionContainer = styled.figcaption`
  padding-left: 6px;
  padding-top: 8px;
`;

const MateriaSubTitle = styled.h4<ColorProps>`
  font-size: 12px;
  font-weight: 400;
  color: ${({ $color }) => $color};
  margin-bottom: 10px;
`;

const PostTitle = styled.h5`
  font-size: 1rem;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;         /* Número máximo de linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 900px) {
    font-size: 14px
  }
`;

type CarouselCardProps = {
  dado: Post;
};

export default function CarouselCard({ dado }: CarouselCardProps) {
  const materia = materias[dado.materia];

  return (
    <Card>
      <IconContainer $backgroundColor={materia.backgroundColor}>
        <Icon $color={materia.color} className="material-symbols-outlined">
          {materia.icon}
        </Icon>
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
