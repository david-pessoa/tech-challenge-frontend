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
  border: 1px solid rgba(230, 75, 99, 0.25);
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 0.75rem 2rem rgba(50, 67, 77, 0.24);
  color: ${({ theme }) => theme.colors.text};
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const AlertIcon = styled.span`
  align-items: center;
  background: rgba(230, 75, 99, 0.08);
  border: 0.5rem solid rgba(230, 75, 99, 0.05);
  border-radius: 50%;
  color: #e64b63;
  display: flex;
  font-size: 2rem;
  font-variation-settings: 'FILL' 1;
  height: 4rem;
  justify-content: center;
  line-height: 1;
  width: 4rem;
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
  border: 1px solid #e64b63;
  border-radius: 1.25rem;
  background: ${({ $secondary }) => ($secondary ? 'transparent' : '#e64b63')};
  color: ${({ $secondary }) => ($secondary ? '#e64b63' : '#fff')};
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
          <AlertIcon className="material-symbols-outlined">error</AlertIcon>
          <ModalTitle id="delete-user-title">Você deseja remover o usuário "{user.nome}"?</ModalTitle>
        </ModalHeader>
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
