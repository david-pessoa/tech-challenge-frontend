import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';
import { formatarData } from '../utils/functions';
import { useNavigate } from 'react-router-dom';

type ViewedPostsTableProps = {
  dados: Post[];
};

const Table = styled.table`
  width: 100%;
`;

const Tr = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: #e49e35a4;
  }
`;

const Td = styled.td`
  max-width: 118px;
  text-align: center;
`;

const MateriaContainer = styled.div`
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type ColorProps = {
  $backgroundColor: string;
  $color: string;
};

const IconContainer = styled.div<ColorProps>`
  height: 60px;
  width: 60px;
  border-radius: 10px;
  color: ${({ $color }) => $color};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

const Icon = styled.span`
  font-size: 32px;
`;

type FontColorProps = {
  $color: string;
};

const MateriaTitle = styled.p<FontColorProps>`
  font-size: 12px;
  color: ${({ $color }) => $color};
`;

export default function ViewedPostsTable({ dados }: ViewedPostsTableProps) {
  const navigate = useNavigate();
  
  return (
    <Table>
      <thead>
        <tr>
          <th>Matérias</th>
          <th>Título</th>
          <th>Descrição</th>
          <th>Data de Criação</th>
          <th>Data de Modificação</th>
          <th>Professor</th>
        </tr>
      </thead>
      <tbody>
        {dados.length === 0 ? (
          <tr>
            <Td colSpan={6}>Não há posts para visualizar</Td>
          </tr>
        ) : (dados.map((post, i) => (
          <Tr
            key={i}
            onClick={() => navigate(`/post/${post.postId}`)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigate(`/post/${post.postId}`);
              }
            }}
            role="link"
            tabIndex={0}
          >
            <Td>
              <MateriaContainer>
                <IconContainer
                  $backgroundColor={materias[post.subject.nome].backgroundColor}
                  $color={materias[post.subject.nome].color}
                >
                  <Icon className="material-symbols-outlined">
                    {materias[post.subject.nome].icon}
                  </Icon>
                </IconContainer>
                <MateriaTitle $color={materias[post.subject.nome].color}>
                  {post.subject.nome}
                </MateriaTitle>
              </MateriaContainer>
            </Td>
            <Td className="bold">
              {post.titulo}
            </Td>
            <Td>{post.descricao}</Td>
            <Td>{formatarData(post.dataCriacao)}</Td>
            <Td>{formatarData(post.dataModificacao)}</Td>
            <Td>{post.criadoPor.nome}</Td>
          </Tr>
        )))}
      </tbody>
    </Table>
  );
}
