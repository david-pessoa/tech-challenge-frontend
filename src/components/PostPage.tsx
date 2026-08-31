import styled from 'styled-components';
import type { Role } from '../types/Roles';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostById } from '../services/post.service';
import type { Post } from '../types/Posts';

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
  ADMIN: {
    background: '#6FB2A7',
    border: '2px solid #A4F3E5',
  },
  PROFESSOR: {
    background: '#FBB3BE',
    border: '2px solid #F7CED2',
  },
  ALUNO: {
    background: '#FDE9A0',
    border: '2px solid #FEF1CE',
  },
};

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

  &:hover {
    transform: translateY(-3px);
  }
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

const AvatarCircle = styled.div<{ $role?: Role, $bg?: string, $border?: string, $size?: string }>`
  width: ${props => props.$size || '32px'};
  height: ${props => props.$size || '32px'};
  border-radius: 50%;
  background-color: ${props => props.$role ? userCircleColors[props.$role].background : props.$bg};
  border: ${props => props.$role ? userCircleColors[props.$role].border : `2px solid ${props.$border}`};
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

  &:hover {
    opacity: 0.8;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
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
    top: -25px;
    width: 2px;
    height: 40px;
    background-color: #E6EBEF;
  }
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentTime = styled.span`
  color: #7892A1;
  font-size: 11px;
  margin-top: 4px;
`;

const CommentText = styled.p`
  color: #32434D;
  font-size: 14px;
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

const Circle = styled.img<{ $role: Role }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ $role }) => userCircleColors[$role]?.background || '#6FB2A7'};
  border: ${({ $role }) => userCircleColors[$role]?.border || '2px solid #A4F3E5'};
`;

export default function PostPage() {
  document.title = 'Edify | Post';

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getPostById(id)
        .then((data) => setPost(data))
        .catch((err) => {
          console.error("Erro ao carregar post:", err);
          setPost(null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <PageContainer>
          <ContentWrapper style={{ alignItems: 'center', marginTop: '50px' }}>
            <Titulo>Carregando aula...</Titulo>
          </ContentWrapper>
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

  return (
    <>
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
            <InputContainer>
              <StyledTextarea placeholder="Faça uma pergunta" />
              <SubmitButton>Enviar</SubmitButton>
            </InputContainer>

            <QuestionsTitle>Perguntas</QuestionsTitle>

            <CommentsList>
              <CommentItem>
                <AvatarCircle $size="30px" $bg="#D2B4DE" $border="#E8DAEF" />
                <CommentContent>
                  <CommentHeader>
                    <AuthorName>Antônio</AuthorName>
                    <CommentTime>58 minutos atrás</CommentTime>
                  </CommentHeader>
                  <CommentText>Por que os sapos costumam aparecer nas casas e quintais urbanos?</CommentText>
                </CommentContent>
              </CommentItem>
              <CommentItem>
                <AvatarCircle $size="30px" $bg="#F1948A" $border="#FADBD8" />
                <CommentContent>
                  <CommentHeader>
                    <AuthorName>Josefa</AuthorName>
                    <CommentTime>2h10 minutos atrás</CommentTime>
                  </CommentHeader>
                  <CommentText>Por que é perigoso e cruel jogar sal em um sapo?</CommentText>
                </CommentContent>
              </CommentItem>
              <CommentItem>
                <AvatarCircle $size="30px" $bg="#A3E4D7" $border="#D1F2EB" />
                <CommentContent>
                  <CommentHeader>
                    <AuthorName>Pedro</AuthorName>
                    <CommentTime>3h58 minutos atrás</CommentTime>
                  </CommentHeader>
                  <CommentText>O que significa dizer que os sapos são 'bioindicadores' do meio ambiente?</CommentText>
                </CommentContent>
              </CommentItem>
              <CommentItem>
                <AvatarCircle $size="30px" $bg="#F5CBA7" $border="#FAE5D3" />
                <CommentContent>
                  <CommentHeader>
                    <AuthorName>Sofia</AuthorName>
                    <CommentTime>1 dia atrás</CommentTime>
                  </CommentHeader>
                  <CommentText>Por que os sapos estão aparecendo cada vez mais nas cidades?</CommentText>
                </CommentContent>
              </CommentItem>
              <CommentItem $isReply>
                <AvatarCircle $role="ALUNO" $size="30px" />
                <CommentContent>
                  <CommentHeader>
                    <AuthorName>José</AuthorName>
                    <CommentTime>Agora</CommentTime>
                  </CommentHeader>
                  <CommentText>Por causa da perda de seus habitats naturais, buscando o microclima úmido das casas e os insetos atraídos pela luz urbana.</CommentText>
                </CommentContent>
              </CommentItem>
            </CommentsList>
          </QuestionsSection>

        </ContentWrapper>
      </PageContainer>

      <Footer />
    </>
  );
}