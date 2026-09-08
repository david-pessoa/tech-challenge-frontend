import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';
import { formatarData } from '../utils/functions';
import { deletePost } from '../services/post.service';
import { useState } from 'react';
import { useUser } from '../context/AuthContext';
import { Toast, ToastCloseButton, type ToastStatus } from './ToastComponents';
import DeletePostModal from './DeletePostModal';

type AdminPostsTableProps = {
  dados: Post[];
};

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
  const [toast, setToast] = useState<{ message: string; status: boolean } | null>(null);
  const [postList, setPostList] = useState<Post[]>(dados);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { user } = useUser();

  async function openDeleteModal(post: Post) {
    setSelectedPost(post);
  }

  function handleCancel() {
    setSelectedPost(null);
  }

  function handleSuccessDeleteMessage() {
    setPostList(prevPostList =>
      prevPostList.filter((post: Post) => post.postId !== selectedPost?.postId)
    );
    setToast({ message: 'O usuário foi deletado com sucesso', status: true });
  }

  function handleDeleteErrorMessage() {
    setToast({ message: 'Erro ao deletar usuário', status: false });
  }

  return (
    <>
      {toast && (
        <Toast $isSucess={toast.status}>
          <span>{toast.message}</span>
          <ToastCloseButton
            type="button"
            onClick={() => setToast(null)}
            aria-label="Fechar mensagem"
          >
            <span className="material-symbols-outlined">close</span>
          </ToastCloseButton>
        </Toast>
      )}
      {selectedPost && (
        <DeletePostModal
          post={selectedPost}
          onCancel={handleCancel}
          showSucessMessage={handleSuccessDeleteMessage}
          showErrorMessage={handleDeleteErrorMessage}
        />
      )}
      <Table>
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
                      $backgroundColor={materias[post?.subject?.nome ?? 'Geral'].backgroundColor}
                      $color={materias[post?.subject?.nome ?? 'Geral'].color}
                    >
                      <Icon className="material-symbols-outlined">
                        {materias[post?.subject?.nome ?? 'Geral'].icon}
                      </Icon>
                    </IconContainer>
                    <MateriaTitle $color={materias[post?.subject?.nome ?? 'Geral'].color}>
                      {post?.subject?.nome}
                    </MateriaTitle>
                  </MateriaContainer>
                </Td>
                <Td className="bold">
                  <Link href={`/post/${post.postId}`}>{post.titulo}</Link>
                </Td>
                <Td>{post.descricao}</Td>
                <Td>{formatarData(post?.dataCriacao)}</Td>
                <Td>{formatarData(post?.dataModificacao)}</Td>
                {user?.role === 'ADMIN' && (
                  <Td>{post?.criadoPor?.nome ? post.criadoPor.nome : '--'}</Td>
                )}
                <Td>
                  <ActionContainer>
                    <EditButton href={`/post/edit/${post.postId}`}>
                      <EditIcon className="material-symbols-outlined">edit</EditIcon>
                    </EditButton>
                    {user?.role === 'ADMIN' && (
                      <DeleteButton onClick={() => openDeleteModal(post)}>
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
    </>
  );
}
