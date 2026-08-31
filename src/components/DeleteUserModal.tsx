import styled from 'styled-components';

import type { Post } from '../types/Posts';
import type { User } from '../types/User';

type DeleteUserModalProps = {
  user: User;
  posts: Post[];
  onCancel: () => void;
  onConfirm: () => void;
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: rgba(50, 67, 77, 0.35);
  padding: 1rem;
`;

const Modal = styled.div`
  width: min(32rem, 100%);
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 0.75rem 2rem rgba(50, 67, 77, 0.24);
  color: ${({ theme }) => theme.colors.text};
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const ModalText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1rem;
`;

const PostList = styled.ul`
  margin: 0 0 1.5rem;
  padding-left: 1.25rem;
`;

const PostItem = styled.li`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button<{ $secondary?: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 1.25rem;
  background: ${({ $secondary, theme }) => ($secondary ? 'transparent' : theme.colors.primary)};
  color: ${({ $secondary, theme }) => ($secondary ? theme.colors.primary : '#fff')};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
  min-height: 2.25rem;
  min-width: 7rem;
  padding: 0 1.25rem;
`;

export default function DeleteUserModal({ user, posts, onCancel, onConfirm }: DeleteUserModalProps) {
  return (
    <ModalOverlay>
      <Modal role="dialog" aria-modal="true" aria-labelledby="delete-user-title">
        <ModalHeader>
          <ModalTitle id="delete-user-title">Confirmar exclusão</ModalTitle>
        </ModalHeader>

        <ModalText>Você deseja remover o usuário "{user.nome}"?</ModalText>

        {posts.length > 0 && (
          <>
            <ModalText>Os seguintes posts serão removidos:</ModalText>
            <PostList>
              {posts.map(post => (
                <PostItem key={post.postId}>{post.titulo}</PostItem>
              ))}
            </PostList>
          </>
        )}

        <ModalActions>
          <ModalButton type="button" $secondary onClick={onCancel}>
            Cancelar
          </ModalButton>
          <ModalButton type="button" onClick={onConfirm}>
            Remover
          </ModalButton>
        </ModalActions>
      </Modal>
    </ModalOverlay>
  );
}
