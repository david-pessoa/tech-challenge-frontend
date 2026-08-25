import styled from 'styled-components';
import type { Role } from '../types/Roles';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import imagePost from '../assets/imagePost.png';
import featureIcon from '../assets/featureIcon.png';
import cloudIcon from '../assets/cloudIcon.png';
import sunIcon from '../assets/sunIcon.png';
import flowerIcon from '../assets/flowerIcon.png';

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
  margin-bottom: 60px;
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
  font-weight: regular; 
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

const List = styled.ol`
  margin-bottom: 20px;
  padding-left: 20px;
  color: #000000;
  font-size: 16px;
  
  li {
    margin-bottom: 15px;
  }
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

export default function PostPage() {
    document.title = 'Edify | Post';

    const role: Role = 'ALUNO';

    const navigate = useNavigate();

    return (
        <>
            <Header role={role} />

            <PageContainer>
                <ContentWrapper>
                    <BackButton onClick={() => navigate('/')}>
                        <BackIcon className="material-symbols-outlined">arrow_back</BackIcon>
                        Voltar a tela de início
                    </BackButton>

                    <HeaderSection>
                        <Categoria>Ciências</Categoria>

                        <TitleWrapper>
                            <Titulo>Aula 20 - Sapos no meio dos humanos</Titulo>
                            <Doodle src={featureIcon} $top="-35px" $right="-50px" $width="108.77px" />
                        </TitleWrapper>

                        <Subtitulo>Ecologia Urbana, Mitos e Convivência</Subtitulo>

                        <Doodle src={cloudIcon} $top="-45px" $right="-350px" $width="80px" />
                    </HeaderSection>

                    <ImagemPost src={imagePost} alt="Sapos no meio dos humanos" />

                    <AuthorSection>
                        <AuthorRow>
                            <AvatarCircle $role="ALUNO" $size="32px" />
                            <AuthorName>José</AuthorName>
                        </AuthorRow>
                        <PostDates>
                            <span>Criado em 04/08/2026</span>
                            <span>Editado 05/08/2026</span>
                        </PostDates>
                    </AuthorSection>

                    <TextContent>
                        <Doodle src={sunIcon} $top="30px" $left="-90px" $width="68px" />
                        <Doodle src={flowerIcon} $top="220px" $right="-80px" $width="65px" />

                        <Paragraph>
                            Nesta aula, vamos entender como os anfíbios se adaptaram à vida urbana após a perda de seus habitats naturais. Aprenda por que eles são nossos maiores aliados na proteção da saúde pública, desmistifique velhas lendas e descubra como conviver de forma pacífica e ética com esses incríveis controladores de pragas.
                        </Paragraph>

                        <Paragraph>
                            Com o crescimento das cidades e a redução das áreas naturais, os sapos precisaram se adaptar ao nosso ambiente para sobreviver. Nossos jardins oferecem a umidade de que precisam, e a luz dos postes atrai o seu prato principal: insetos.
                        </Paragraph>

                        <List>
                            <li>
                                <strong>Nossos Seguranças Ecológicos:</strong> Ter um sapo no quintal é, na verdade, uma grande sorte. Eles são controladores de pragas naturais e gratuitos. Durante a noite, um único sapo é capaz de devorar dezenas de mosquitos (incluindo o transmissor da dengue), moscas, baratas, aranhas e até mesmo animais peçonhentos perigosos, como escorpiões.
                            </li>
                            <li>
                                <strong>Mitos e Verdades (O Perigo do Sal):</strong> Muitos machucam esses animais por puro desconhecimento. É preciso esclarecer:
                                <ul>
                                    <li>Veneno: Sapos não espirram veneno nos olhos. A toxina fica armazenada em glândulas atrás da cabeça e só é liberada se o animal for espremido ou mordido.</li>
                                    <li>O uso do sal: Jogar sal em um sapo é um ato de extrema crueldade. A pele deles é altamente permeável (eles respiram por ela), e o sal causa uma desidratação severa e uma morte lenta e dolorosa.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>O que fazer ao encontrar um?</strong> Absolutamente nada. Deixe-o seguir seu caminho. Se ele estiver dentro de casa ou em risco de ser pisado, use uma vassoura para empurrá-lo muito suavemente para o jardim. Mantenha cães e gatos afastados por precaução e agradeça a limpeza que ele está fazendo no seu quintal!
                            </li>
                        </List>
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