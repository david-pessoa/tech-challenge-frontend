import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';
import { formatarData } from '../utils/functions';

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
                  $backgroundColor={materias[post.subject.nome].backgroundColor}
                  $color={materias[post.subject.nome].color}
                >
                  <Icon className="material-symbols-outlined">{materias[post.subject.nome].icon}</Icon>
                </IconContainer>
                <MateriaTitle $color={materias[post.subject.nome].color}>{post.subject.nome}</MateriaTitle>
              </MateriaContainer>
            </Td>
            <Td className="bold">
              <Link href={`/post/${post.postId}`}>{post.titulo}</Link>
            </Td>
            <td>{post.descricao}</td>
            <td>{formatarData(post.dataCriacao)}</td>
            <td>{formatarData(post.dataModificacao)}</td>
            <td>{post.criadoPor.nome}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
