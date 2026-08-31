import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';
import { formatarData } from '../utils/functions';
import { deletePost } from '../services/post.service';
import { useState } from 'react';
import { useUser } from '../context/AuthContext';

type AdminPostsTableProps = {
  dados: Post[];
};

type ToastStatus = 'success' | 'error';

const Toast = styled.div<{ $status: ToastStatus }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  width: min(22rem, calc(100% - 2rem));
  border-left: 0.35rem solid
    ${({ $status, theme }) => ($status === 'success' ? '#6FB9A9' : theme.colors.primary)};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.fieldBackground};
  box-shadow: 0 0.5rem 1.5rem rgba(50, 67, 77, 0.16);
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.field.fontSize};
  font-weight: ${({ theme }) => theme.typography.field.fontWeight};
  line-height: ${({ theme }) => theme.typography.field.lineHeight};
  padding: 1rem 1.25rem;

  @media (max-width: 720px) {
    top: 1rem;
    right: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-bottom: 3.625rem;
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

export default function ManagementPostsTable({ dados }: AdminPostsTableProps) {
  const [toast, setToast] = useState<{ message: string; status: ToastStatus } | null>(null);
  const [postList, setPostList] = useState<Post[]>(dados);
  const { user } = useUser();

  async function handleDeletePost(id: string) {
    try {
      const response = await deletePost(id);
      const message = response.message;
      setToast({ message, status: 'success' });
      setPostList(currentList => currentList.filter(p => p.postId !== id));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar post.';
      setToast({ message, status: 'error' });
    }
  }
  return (
    <Table>
      {toast && <Toast $status={toast.status}>{toast.message}</Toast>}
      <thead>
        <tr>
          <th>Matérias</th>
          <th>Título</th>
          <th>Descrição</th>
          <th>Data de Criação</th>
          <th>Data de Modificação</th>
          {user?.role === 'ADMIN' && <th>Professor</th>}
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {postList.length === 0 ? (
          <tr>
            <Td colSpan={user?.role === 'ADMIN' ? 7 : 6}>Não há posts para visualizar</Td>
          </tr>
        ) : (
          postList.map((post, i) => (
            <Tr key={i}>
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
                <Link href={`/post/${post.postId}`}>{post.titulo}</Link>
              </Td>
              <Td>{post.descricao}</Td>
              <Td>{formatarData(post.dataCriacao)}</Td>
              <Td>{formatarData(post.dataModificacao)}</Td>
              {user?.role === 'ADMIN' && <Td>{post.criadoPor.nome}</Td>}
              <Td>
                <ActionContainer>
                  <EditButton href={`/post/edit/${post.postId}`}>
                    <EditIcon className="material-symbols-outlined">edit</EditIcon>
                  </EditButton>
                  {user?.role === 'ADMIN' && (
                    <DeleteButton onClick={() => handleDeletePost(post.postId)}>
                      <DeleteIcon className="material-symbols-outlined">delete</DeleteIcon>
                    </DeleteButton>
                  )}
                </ActionContainer>
              </Td>
            </Tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
