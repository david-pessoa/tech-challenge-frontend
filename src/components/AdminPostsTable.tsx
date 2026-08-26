import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';

type AdminPostsTableProps = {
  dados: Post[];
};

const Table = styled.table`
  width: 100%;
  margin-bottom: 3.625rem;
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

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 10px;
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;
const EditButton = styled.a`
  border: none;
  background: transparent;
`;

const EditIcon = styled.span`
  color: #a15e6d;
  font-size: 24px;
`;

const DeleteIcon = styled.span`
  color: #e64b63;
  font-size: 24px;
`;

type FontColorProps = {
  $color: string;
};

const MateriaTitle = styled.p<FontColorProps>`
  font-size: 12px;
  color: ${({ $color }) => $color};
`;

export default function AdminPostsTable({ dados }: AdminPostsTableProps) {
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
          <th>Ações</th>
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
              <Link href={`/post/${post.id}`}>{post.titulo}</Link>
            </Td>
            <Td>{post.descricao}</Td>
            <Td>{new Intl.DateTimeFormat('pt-BR').format(post.createdAt)}</Td>
            <Td>{new Intl.DateTimeFormat('pt-BR').format(post.editedAt)}</Td>
            <td>{post.autor}</td>
            <td>
              <ActionContainer>
                <EditButton href={`/post/edit/${post.id}`}>
                  <EditIcon className="material-symbols-outlined">edit</EditIcon>
                </EditButton>
                <DeleteButton>
                  <DeleteIcon className="material-symbols-outlined">delete</DeleteIcon>
                </DeleteButton>
              </ActionContainer>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
