import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';
import { formatarData } from '../utils/functions';

const Card = styled.div`
  height: 15.188rem;
  width: 12.5rem;
  border-radius: 20px 0 20px 0;
  background: #fff6d740;
  box-shadow: 2px 2px 4px 0px #0000001a;
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
`;

type ColorProps = {
  $color: string;
};

const Icon = styled.span<ColorProps>`
  font-size: 56px;
  color: ${({ $color }) => $color};
`;

const MateriaTitle = styled.h3<ColorProps>`
  font-size: 22px;
  color: ${({ $color }) => $color};
  font-weight: 600;
`;

const DescriptionContainer = styled.figcaption`
  padding-left: 6px;
  padding-top: 8px;
  box-sizing: border-box;
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
`;

type CarouselCardProps = {
  dado: Post;
};

export default function CarouselCard({ dado }: CarouselCardProps) {
  const materiaName = dado.subject.nome;
  const materiaConfig = materias[materiaName];
  

  return (
    <Card>
      <IconContainer $backgroundColor={materiaConfig.backgroundColor}>
        <Icon $color={materiaConfig.color} className="material-symbols-outlined">
          {materiaConfig.icon}
        </Icon>
        <MateriaTitle $color={materiaConfig.color}>{materiaName}</MateriaTitle>
      </IconContainer>
      <DescriptionContainer>
        <MateriaSubTitle $color={materiaConfig.color}>{materiaName}</MateriaSubTitle>
        <PostTitle>{dado.titulo}</PostTitle>
        <p>
          Publicado em {formatarData(dado.dataCriacao)} por {dado.criadoPor.nome}
        </p>
      </DescriptionContainer>
    </Card>
  );
}
