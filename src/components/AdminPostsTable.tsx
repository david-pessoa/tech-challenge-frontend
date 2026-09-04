import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';
import { deletePost } from '../services/post.service';
import { useNavigate } from 'react-router-dom';

type AdminPostsTableProps = {
  dados: Post[];
  onDeleteSuccess?: (id: string) => void;
};

type ToastStatus = 'success' | 'error';

const Toast = styled.div<{ $status: ToastStatus }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  width: min(22rem, calc(100% - 2rem));
  border-left: 0.35rem solid ${({ $status }) => ($status === 'success' ? '#6FB9A9' : '#e64b63')};
  border-radius: 0.75rem;
  background: #FAF7EA;
  box-shadow: 0 0.5rem 1.5rem rgba(50, 67, 77, 0.16);
  color: #32434D;
  padding: 1rem 1.25rem;
`;

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

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 10px;
`;

const ActionButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: #FFFCF7;
  padding: 2.5rem 3rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  text-align: center;
`;

const ModalIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #F6D4D9;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e64b63;
`;

const ModalText = styled.p`
  font-size: 1.1rem;
  color: #32434D;
  font-weight: 600;
  margin: 0;

  strong {
    color: #e64b63;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  margin-top: 0.5rem;
`;

const ModalButton = styled.button<{ $variant: 'cancel' | 'confirm' }>`
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  ${({ $variant }) =>
    $variant === 'cancel'
      ? `
        background: transparent;
        border: 1px solid #e64b63;
        color: #e64b63;
      `
      : `
        background: #e64b63;
        border: none;
        color: #ffffff;
      `}

  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function AdminPostsTable({ dados, onDeleteSuccess }: AdminPostsTableProps) {
  const [toast, setToast] = useState<{ message: string; status: ToastStatus } | null>(null);
  const navigate = useNavigate();
  const [postToDelete, setPostToDelete] = useState<{ id: string; titulo: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleDeleteClick = (id: string, titulo: string) => {
    setPostToDelete({ id, titulo });
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await deletePost(postToDelete.id);
      setToast({ message: 'Aula deletada com sucesso.', status: 'success' });

      if (onDeleteSuccess) {
        onDeleteSuccess(postToDelete.id);
      }
    } catch (error) {
      setToast({ message: 'Erro ao deletar a aula.', status: 'error' });
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <>
      {toast && <Toast $status={toast.status}>{toast.message}</Toast>}
      {postToDelete && (
        <ModalOverlay>
          <ModalContent>
            <ModalIconWrapper>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>error</span>
            </ModalIconWrapper>
            <ModalText>
              Você deseja remover a aula "{postToDelete.titulo}"?
            </ModalText>
            <ModalActions>
              <ModalButton $variant="cancel" onClick={() => setPostToDelete(null)} disabled={isDeleting}>
                Cancelar
              </ModalButton>
              <ModalButton $variant="confirm" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Removendo...' : 'Remover'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

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
            <tr key={post.postId || i}>
              <Td>
                <MateriaContainer>
                  <IconContainer
                    $backgroundColor={materias[post.materia]?.backgroundColor || '#E6EBEF'}
                    $color={materias[post.materia]?.color || '#3A505D'}
                  >
                    <Icon className="material-symbols-outlined">
                      {materias[post.materia]?.icon || 'menu_book'}
                    </Icon>
                  </IconContainer>
                  <MateriaTitle $color={materias[post.materia]?.color || '#3A505D'}>
                    {post.materia}
                  </MateriaTitle>
                </MateriaContainer>
              </Td>
              <Td className="bold">
                <Link href={`/post/${post.postId}`}>{post.titulo}</Link>
              </Td>
              <Td>{post.descricao}</Td>
              <Td>{new Intl.DateTimeFormat('pt-BR').format(new Date(post.createdAt))}</Td>
              <Td>{new Intl.DateTimeFormat('pt-BR').format(new Date(post.editedAt))}</Td>
              <td>{post.autor}</td>
              <td>
                <ActionContainer>
                  <ActionButton onClick={() => navigate(`/post/edit/${post.postId}`)}>
                    <EditIcon className="material-symbols-outlined">edit</EditIcon>
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteClick(post.postId, post.titulo)}>
                    <DeleteIcon className="material-symbols-outlined">delete</DeleteIcon>
                  </ActionButton>
                </ActionContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}