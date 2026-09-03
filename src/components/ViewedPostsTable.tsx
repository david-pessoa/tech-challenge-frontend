import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';

type ViewedPostsTableProps = {
  dados: Post[];
};

const Table = styled.table`
  width: 100%;
`;

const Td = styled.td`
  max-width: 118px;
`;

const MateriaContainer = styled.div`
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 900px) {
    max-width: 50px;
  }
`;

const Link = styled.a`
  color: inherit;
  text-decoration: none;
  display: block;
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

  @media (max-width: 900px) {
    height: 42px;
    width: 42px;
  }
`;

const Icon = styled.span`
  font-size: 32px;

  @media (max-width: 900px) {
    font-size: 20px;
  }
`;

type FontColorProps = {
  $color: string;
};

const MateriaTitle = styled.p<FontColorProps>`
  font-size: 12px;
  color: ${({ $color }) => $color};

  @media (max-width: 900px) {
    font-size: 10px;
  }
`;

export default function ViewedPostsTable({ dados }: ViewedPostsTableProps) {
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
        {dados.map((post, i) => (
          <tr key={i}>
            <Td>
              <MateriaContainer>
                <IconContainer
                  $backgroundColor={materias[post.materia].backgroundColor}
                  $color={materias[post.materia].color}
                >
                  <Icon className="material-symbols-outlined">{materias[post.materia].icon}</Icon>
                </IconContainer>
                <MateriaTitle $color={materias[post.materia].color}>{post.materia}</MateriaTitle>
              </MateriaContainer>
            </Td>
            <Td className="bold">
              <Link href={`/post/${post.postId}`}>{post.titulo}</Link>
            </Td>
            <Td>{post.descricao}</Td>
            <Td>{new Intl.DateTimeFormat('pt-BR').format(post.createdAt)}</Td>
            <Td>{new Intl.DateTimeFormat('pt-BR').format(post.editedAt)}</Td>
            <Td>{post.autor}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
