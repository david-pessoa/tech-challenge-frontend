import styled from 'styled-components';
import type { Role } from '../types/Roles';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostById, createComment, getCommentsByPostId, updateComment, deleteComment } from '../services/post.service';
import type { Post, CommentAPI } from '../types/Posts';

import { useUser } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

import imagePost from '../assets/imagePost.png';
import featureIcon from '../assets/featureIcon.png';
import cloudIcon from '../assets/cloudIcon.png';
import sunIcon from '../assets/sunIcon.png';
import flowerIcon from '../assets/flowerIcon.png';
import userDefaultImage from '../assets/user-default-image.png';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const userCircleColors = {
  ADMIN: { background: '#6FB2A7', border: '2px solid #A4F3E5' },
  PROFESSOR: { background: '#FBB3BE', border: '2px solid #F7CED2' },
  ALUNO: { background: '#FDE9A0', border: '2px solid #FEF1CE' },
};

function calcularTempoAtras(dataString: string) {
  const data = new Date(dataString);
  const agora = new Date();
  const diferencaSegundos = Math.floor((agora.getTime() - data.getTime()) / 1000);

  if (diferencaSegundos < 60) return 'Agora mesmo';
  const diferencaMinutos = Math.floor(diferencaSegundos / 60);
  if (diferencaMinutos < 60) return `${diferencaMinutos} minuto${diferencaMinutos !== 1 ? 's' : ''} atrás`;
  const diferencaHoras = Math.floor(diferencaMinutos / 60);
  if (diferencaHoras < 24) return `${diferencaHoras} hora${diferencaHoras !== 1 ? 's' : ''} atrás`;
  const diferencaDias = Math.floor(diferencaHoras / 24);
  if (diferencaDias < 30) return `${diferencaDias} dia${diferencaDias !== 1 ? 's' : ''} atrás`;
  return new Intl.DateTimeFormat('pt-BR').format(data);
}

function getAvatarColor(name: string) {
  const colors = ['#D2B4DE', '#F1948A', '#A3E4D7', '#F5CBA7', '#AED6F1'];
  return colors[name.length % colors.length];
}

type ToastStatus = 'success' | 'error';

const Toast = styled.div<{ $status: ToastStatus }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  width: min(22rem, calc(100% - 2rem));
  border-left: 0.35rem solid ${({ $status, theme }) => ($status === 'success' ? '#6FB9A9' : theme.colors.primary)};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.fieldBackground || '#FAF7EA'};
  box-shadow: 0 0.5rem 1.5rem rgba(50, 67, 77, 0.16);
  color: ${({ theme }) => theme.colors.text || '#32434D'};
  padding: 1rem 1.25rem;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 252, 247, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh; 
  width: 100%;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid #F6D4D9;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
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

  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFCF7; 
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 40px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #3A505D;
  font-size: 15px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  left: -10px;
  transition: transform 0.2s ease-in-out;

  &:hover { transform: translateY(-3px); }
`;

const BackIcon = styled.span`
  color: #FDDF00; 
  font-size: 24px; 
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  align-self: center;
`;

const Categoria = styled.p`
  color: #287C6D; 
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const TitleWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Titulo = styled.h1`
  color: #32434D;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px; 
`;

const Subtitulo = styled.p`
  color: #7A8B94; 
  font-size: 16px;
  font-weight: 400;
`;

const ImagemPost = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px; 
  margin-bottom: 40px;
`;

const AuthorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 40px;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvatarCircle = styled.div<{ $bg?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.$bg || '#D2B4DE'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
`;

const AuthorName = styled.span`
  color: #32434D;
  font-size: 15px;
`;

const PostDates = styled.p`
  color: #3A505D;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const TextContent = styled.div`
  color: #32434D;
  font-size: 16px;
  line-height: 1.6;
  position: relative;
`;

const Paragraph = styled.p`
  margin-bottom: 20px;
  color: #000000;
  font-size: 16px;
`;

const EmptyCommentsText = styled.p`
  text-align: center;
  color: #7A8B94;
  font-size: 16px;
  font-style: italic;
  margin-top: 20px;
`;

const QuestionsSection = styled.section`
  margin-top: 60px;
  width: 100%;
`;

const QuestionsTitle = styled.h2`
  color: #3A505D;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const InputContainer = styled.div`
  background-color: #FAF7EA;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 60px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const StyledTextarea = styled.textarea`
  background: transparent;
  border: none;
  resize: none;
  font-size: 16px;
  color: #603C24;
  outline: none;
  min-height: 60px;
  
  &::placeholder {
    color: #603C24;
    font-size: 16px;
    font-weight: bold;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  background-color: #FCBBA3;
  color: #603C;
  border: none;
  padding: 8px 30px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const CommentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentItem = styled.div<{ $isReply?: boolean }>`
  display: flex;
  gap: 15px;
  margin-left: ${props => props.$isReply ? '47px' : '0'};
  position: relative;

  &::before {
    content: '';
    display: ${props => props.$isReply ? 'block' : 'none'};
    position: absolute;
    left: -24px;
    top: -30px;
    width: 14px;
    height: 45px;
    border-left: 2px solid #E6EBEF;
    border-bottom: 2px solid #E6EBEF;
    border-bottom-left-radius: 8px;
  }
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const CommentTime = styled.span`
  color: #7892A1;
  font-size: 11px;
  margin-top: 4px;
  display: block;
`;

const CommentText = styled.p`
  color: #32434D;
  font-size: 14px;
  line-height: 1.4;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;

    &:hover { opacity: 0.7; }
  }
`;

const EditIcon = styled.span`
  color: #A15E6D;
  font-size: 20px;
`;

const DeleteIcon = styled.span`
  color: #E64B63;
  font-size: 20px;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-top: 5px;
  text-align: left;
  width: fit-content;

  &:hover { text-decoration: underline; }
`;

const ReplyInputContainer = styled(InputContainer)`
  margin-left: 47px;
  margin-bottom: 0;
  padding: 15px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.15);
  
  textarea { min-height: 40px; }
`;

const EditInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  background-color: #FAF7EA;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  textarea {
    width: 100%;
    border: none;
    resize: vertical;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    color: #603C24;
    background-color: #FAF7EA;
    min-height: 40px;
  }
`;

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 4px 12px;
    font-size: 12px;
  }
`;

const Doodle = styled.img<{ $top?: string, $right?: string, $left?: string, $bottom?: string, $width?: string }>`
  position: absolute;
  top: ${props => props.$top};
  right: ${props => props.$right};
  left: ${props => props.$left};
  bottom: ${props => props.$bottom};
  width: ${props => props.$width || '50px'};
  z-index: 1;
  pointer-events: none; 
`;

const Circle = styled.img<{ $role?: Role }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ $role }) => $role ? userCircleColors[$role]?.background : '#6FB2A7'};
  border: ${({ $role }) => $role ? userCircleColors[$role]?.border : '2px solid #A4F3E5'};
`;

export default function PostPage() {
  document.title = 'Edify | Post';

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; status: ToastStatus } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const carregarAulaEComentarios = async () => {
    if (!id) return;
    try {
      const postData = await getPostById(id);
      setPost(postData);
      const commentsData = await getCommentsByPostId(id);
      setComments(commentsData);

      const imgSrc = postData.image ? `${BASE_URL}${postData.image}` : imagePost;
      const img = new Image();

      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = imgSrc;
    } catch (err) {
      console.error("Erro ao carregar post ou comentários:", err);
      setPost(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    carregarAulaEComentarios();
  }, [id]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !id) return;

    setIsSubmittingComment(true);
    try {
      await createComment(id, newComment);
      setNewComment('');
      await carregarAulaEComentarios();
      setToast({ message: 'Pergunta enviada com sucesso!', status: 'success' });
    } catch (error) {
      setToast({ message: 'Ocorreu um erro ao enviar sua pergunta.', status: 'error' });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim() || !id) return;

    setIsSubmittingReply(true);
    try {
      await createComment(id, replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
      await carregarAulaEComentarios();
      setToast({ message: 'Resposta enviada com sucesso!', status: 'success' });
    } catch (error) {
      setToast({ message: 'Ocorreu um erro ao enviar a resposta.', status: 'error' });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const startEditing = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsSubmittingEdit(true);
    try {
      await updateComment(commentId, editContent);
      setEditingCommentId(null);
      setEditContent('');
      await carregarAulaEComentarios();
      setToast({ message: 'Comentário atualizado!', status: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao atualizar o comentário.', status: 'error' });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteComment(commentToDelete);
      setCommentToDelete(null);
      await carregarAulaEComentarios();
      setToast({ message: 'Comentário removido!', status: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao remover o comentário.', status: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <PageContainer>
          <LoadingWrapper>
            <Spinner />
            <LoadingText>Carregando aula...</LoadingText>
          </LoadingWrapper>
        </PageContainer>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <PageContainer>
          <ContentWrapper style={{ alignItems: 'center', marginTop: '50px' }}>
            <Titulo>Aula não encontrada!</Titulo>
            <BackButton style={{ position: 'relative', left: '0' }} onClick={() => navigate('/')}>
              <BackIcon className="material-symbols-outlined">arrow_back</BackIcon>
              Voltar a tela de início
            </BackButton>
          </ContentWrapper>
        </PageContainer>
        <Footer />
      </>
    );
  }

  const authorRole = post.criadoPor?.tipoUsuario || 'ADMIN';
  const authorImage = post.criadoPor?.image ? `${BASE_URL}${post.criadoPor.image}` : userDefaultImage;
  const isOwner = user?.nome === post.autor;
  const isOverlayLoading = isSubmittingComment || isSubmittingReply || isSubmittingEdit || isDeleting;

  const canEditComment = (commentAuthor: string) => {
    return user?.nome === commentAuthor;
  };

  const canDeleteComment = (commentAuthor: string) => {
    if (user?.role === 'ADMIN') return true;
    if (user?.role === 'PROFESSOR' && isOwner) return true;
    if (user?.nome === commentAuthor) return true;
    return false;
  };

  return (
    <>
      {isOverlayLoading && (
        <Overlay>
          <Spinner />
          <LoadingText>
            {isDeleting ? 'Removendo...' : isSubmittingEdit ? 'Atualizando...' : 'Enviando...'}
          </LoadingText>
        </Overlay>
      )}

      {commentToDelete && (
        <ModalOverlay>
          <ModalContent>
            <ModalIconWrapper>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>error</span>
            </ModalIconWrapper>
            <ModalText>Você deseja remover este comentário?</ModalText>
            <ModalActions>
              <ModalButton $variant="cancel" onClick={() => setCommentToDelete(null)} disabled={isDeleting}>
                Cancelar
              </ModalButton>
              <ModalButton $variant="confirm" onClick={confirmDeleteComment} disabled={isDeleting}>
                {isDeleting ? 'Removendo...' : 'Remover'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
      {toast && <Toast $status={toast.status}>{toast.message}</Toast>}
      <Header />
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={() => navigate('/')}>
            <BackIcon className="material-symbols-outlined">arrow_back</BackIcon>
            Voltar a tela de início
          </BackButton>

          <HeaderSection>
            <Categoria>{post.materia}</Categoria>

            <TitleWrapper>
              <Titulo>{post.titulo}</Titulo>
              <Doodle src={featureIcon} $top="-35px" $right="-50px" $width="108.77px" />
            </TitleWrapper>

            <Subtitulo>{post.descricao}</Subtitulo>
            <Doodle src={cloudIcon} $top="-45px" $right="-350px" $width="80px" />
          </HeaderSection>

          <ImagemPost
            src={post.image ? `${BASE_URL}${post.image}` : imagePost}
            alt={post.titulo}
          />

          <AuthorSection>
            <AuthorRow>
              <Circle src={authorImage} $role={authorRole} alt={post.autor} />
              <AuthorName>{post.autor}</AuthorName>
            </AuthorRow>
            <PostDates>
              <span>Criado em {new Intl.DateTimeFormat('pt-BR').format(post.createdAt)}</span>
              <span>Editado em {new Intl.DateTimeFormat('pt-BR').format(post.editedAt)}</span>
            </PostDates>
          </AuthorSection>

          <TextContent>
            <Doodle src={sunIcon} $top="30px" $left="-90px" $width="68px" />
            <Doodle src={flowerIcon} $top="220px" $right="-80px" $width="65px" />
            <Paragraph>{post.conteudo}</Paragraph>
          </TextContent>

          <QuestionsSection>
            <QuestionsTitle>Perguntas</QuestionsTitle>
            <InputContainer>
              <StyledTextarea
                placeholder="Faça uma pergunta"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmittingComment}
              />
              <SubmitButton
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? 'Enviando...' : 'Enviar'}
              </SubmitButton>
            </InputContainer>

            <CommentsList>
              {comments.length === 0 ? (
                <EmptyCommentsText>Nenhuma pergunta nesta aula ainda. Seja o primeiro a interagir!</EmptyCommentsText>
              ) : (
                comments.map((comment) => (
                  <CommentGroup key={comment.id}>
                    <CommentItem>
                      {comment.image ? (
                        <Circle src={`${BASE_URL}${comment.image}`} alt={comment.user} style={{ width: '32px', height: '32px' }} />
                      ) : (
                        <AvatarCircle $bg={getAvatarColor(comment.user)}>
                          {comment.user.charAt(0).toUpperCase()}
                        </AvatarCircle>
                      )}
                      <CommentContent>
                        <CommentHeader>
                          <div>
                            <AuthorName>{comment.user}</AuthorName>
                            <CommentTime>{calcularTempoAtras(comment.dataCriacao)}</CommentTime>
                          </div>

                          {(canEditComment(comment.user) || canDeleteComment(comment.user)) && (
                            <CommentActions>
                              {canEditComment(comment.user) && (
                                <button onClick={() => startEditing(comment.id, comment.conteudo)} title="Editar">
                                  <EditIcon className="material-symbols-outlined">edit</EditIcon>
                                </button>
                              )}
                              {canDeleteComment(comment.user) && (
                                <button onClick={() => setCommentToDelete(comment.id)} title="Excluir">
                                  <DeleteIcon className="material-symbols-outlined">delete</DeleteIcon>
                                </button>
                              )}
                            </CommentActions>
                          )}
                        </CommentHeader>

                        {editingCommentId === comment.id ? (
                          <EditInputContainer>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              disabled={isSubmittingEdit}
                            />
                            <EditActions>
                              <SubmitButton
                                onClick={() => setEditingCommentId(null)}
                                disabled={isSubmittingEdit}
                                style={{ background: 'transparent', color: '#e64b63', border: '1px solid #e64b63' }}
                              >
                                Cancelar
                              </SubmitButton>
                              <SubmitButton
                                onClick={() => handleEditSubmit(comment.id)}
                                disabled={isSubmittingEdit || !editContent.trim()}
                              >
                                Salvar
                              </SubmitButton>
                            </EditActions>
                          </EditInputContainer>
                        ) : (
                          <CommentText>{comment.conteudo}</CommentText>
                        )}

                        {isOwner && !comment.childComment && editingCommentId !== comment.id && (
                          <ReplyButton onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                            {replyingTo === comment.id ? 'Cancelar resposta' : 'Responder'}
                          </ReplyButton>
                        )}
                      </CommentContent>
                    </CommentItem>
                    {replyingTo === comment.id && (
                      <ReplyInputContainer>
                        <StyledTextarea
                          placeholder="Escreva sua resposta..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          disabled={isSubmittingReply}
                        />
                        <SubmitButton
                          onClick={() => handleReplySubmit(comment.id)}
                          disabled={isSubmittingReply || !replyContent.trim()}
                        >
                          {isSubmittingReply ? 'Enviando...' : 'Responder'}
                        </SubmitButton>
                      </ReplyInputContainer>
                    )}
                    {comment.childComment && (
                      <CommentItem $isReply>
                        <Circle
                          src={comment.childComment.image ? `${BASE_URL}${comment.childComment.image}` : authorImage}
                          $role={authorRole}
                          alt={post.autor}
                          style={{ width: '32px', height: '32px' }}
                        />
                        <CommentContent>
                          <CommentHeader>
                            <div>
                              <AuthorName>{post.autor}</AuthorName>
                              <CommentTime>{calcularTempoAtras(comment.childComment.dataCriacao)}</CommentTime>
                            </div>

                            {(canEditComment(post.autor) || canDeleteComment(post.autor)) && (
                              <CommentActions>
                                {canEditComment(post.autor) && (
                                  <button onClick={() => startEditing(comment.childComment!.id, comment.childComment!.conteudo)} title="Editar">
                                    <EditIcon className="material-symbols-outlined">edit</EditIcon>
                                  </button>
                                )}
                                {canDeleteComment(post.autor) && (
                                  <button onClick={() => setCommentToDelete(comment.childComment!.id)} title="Excluir">
                                    <DeleteIcon className="material-symbols-outlined">delete</DeleteIcon>
                                  </button>
                                )}
                              </CommentActions>
                            )}
                          </CommentHeader>

                          {editingCommentId === comment.childComment.id ? (
                            <EditInputContainer>
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                disabled={isSubmittingEdit}
                              />
                              <EditActions>
                                <SubmitButton
                                  onClick={() => setEditingCommentId(null)}
                                  disabled={isSubmittingEdit}
                                  style={{ background: 'transparent', color: '#e64b63', border: '1px solid #e64b63' }}
                                >
                                  Cancelar
                                </SubmitButton>
                                <SubmitButton
                                  onClick={() => handleEditSubmit(comment.childComment!.id)}
                                  disabled={isSubmittingEdit || !editContent.trim()}
                                >
                                  Salvar
                                </SubmitButton>
                              </EditActions>
                            </EditInputContainer>
                          ) : (
                            <CommentText>{comment.childComment.conteudo}</CommentText>
                          )}

                        </CommentContent>
                      </CommentItem>
                    )}
                  </CommentGroup>
                ))
              )}
            </CommentsList>
          </QuestionsSection>

        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
}