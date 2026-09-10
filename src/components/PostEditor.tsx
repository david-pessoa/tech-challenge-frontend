import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import redDoodle from '../assets/red-doodle.png';
import { createPost, getPostById, updatePost } from '../services/post.service';
import { materias } from '../types/Materias';
import { Toast } from './ToastComponents';

type PostEditorProps = {
  isNew: boolean;
};

type PostFormData = {
  titulo: string;
  descricao: string;
  conteudo: string;
  subjectName: string;
  image: File | null;
};

const initialFormData: PostFormData = {
  titulo: '',
  descricao: '',
  conteudo: '',
  subjectName: 'Geral',
  image: null,
};

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
  min-height: 40vh; 
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

const Main = styled.main`
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto 5rem;
  padding: 0 clamp(1rem, 8.55vw, 7.6875rem);
`;

const BackLink = styled.button`
  color: ${({ theme }) => theme.colors.backLink};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.backLink.fontSize};
  font-weight: ${({ theme }) => theme.typography.backLink.fontWeight};
  margin-bottom: 1.5rem;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    color: ${({ theme }) => theme.colors.backIcon};
    font-size: 1.125rem;
    transform: rotate(-90deg);
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  text-align: center;
  margin: 0;
`;

const TitleIcon = styled.img`
  width: 4rem;
  margin-left: -1.2rem;
  transform: translateY(-0.65rem) rotate(12deg);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const PhotoField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center; 
  position: relative;
  width: 682px;
  height: 309px;

  @media (max-width: 720px) {
    width: 100%;
    height: auto;
  }
`;

const PhotoUpload = styled.label<{ $hasImage: boolean }>`
  position: relative;
  width: 100%;
  height: 15.625rem; 
  border-radius: 1rem; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  
  border: ${({ $hasImage, theme }) =>
        $hasImage ? 'none' : `2px dashed ${theme.colors.primary}`};

  input {
    display: none;
  }
`;

const PhotoPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem; 
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  gap: 0.5rem;
`;

const UploadIcon = styled.span`
  font-size: 2.5rem;
`;

const UploadText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
`;

const OptionalText = styled.span`
  font-size: 0.85rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 20px;
  left: -10px;
  width: 1.8rem;
  height: 1.8rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  background: #F6D4D9;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  padding: 0;
  z-index: 2;

  &:hover {
    opacity: 0.8;
  }
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 1.25rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${({ $full }) => ($full ? '1 / -1' : 'auto')};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.field.fontSize};
  font-weight: ${({ theme }) => theme.typography.field.fontWeight};
`;

const LabelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CharCount = styled.span<{ $isNearLimit: boolean }>`
  font-size: 0.8rem;
  color: ${({ $isNearLimit, theme }) => $isNearLimit ? '#e64b63' : theme.colors.text};
  opacity: ${({ $isNearLimit }) => $isNearLimit ? 1 : 0.6};
  font-weight: ${({ $isNearLimit }) => $isNearLimit ? 'bold' : 'normal'};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const fieldControlStyles = ({ theme }: { theme: typeof import('../styles/theme').theme }) => `
  border: 0;
  border-radius: 1.5rem;
  background: ${theme.colors.fieldBackground};
  box-shadow: 0 2px 5px ${theme.colors.fieldShadow};
  color: ${theme.colors.text};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.field.fontSize};
  font-weight: ${theme.typography.field.fontWeight};
  padding: 0 1.25rem;

  &::placeholder {
    color: ${theme.colors.fieldPlaceholder};
    opacity: 1;
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.fieldFocus};
  }
`;

const Input = styled.input`
  ${fieldControlStyles}
  min-height: 2.75rem;
`;

const Select = styled.select`
  ${fieldControlStyles}
  min-height: 2.75rem;
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, #98816d 50%),
    linear-gradient(135deg, #98816d 50%, transparent 50%);
  background-position:
    calc(100% - 1.65rem) 50%,
    calc(100% - 1.3rem) 50%;
  background-repeat: no-repeat;
  background-size: 0.38rem 0.38rem, 0.38rem 0.38rem;
  cursor: pointer;
  padding-right: 3.25rem;
`;

const Textarea = styled.textarea`
  ${fieldControlStyles}
  min-height: 12rem;
  padding: 1.25rem;
  resize: vertical;
  border-radius: 1rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $secondary?: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 1.25rem;
  background: ${({ $secondary, theme }) => ($secondary ? 'transparent' : theme.colors.primary)};
  color: ${({ $secondary, theme }) => ($secondary ? theme.colors.primary : '#fff')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.field.fontSize};
  min-height: 2.25rem;
  min-width: 7rem;
  padding: 0 1.25rem;
  transition: opacity 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

export default function PostEditor({ isNew }: PostEditorProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<PostFormData>(initialFormData);
    const [imagePreview, setImagePreview] = useState('');
    const [toast, setToast] = useState<{ message: string; status: boolean } | null>(null);
    
    const [isFetching, setIsFetching] = useState(!isNew); 
    const [isProcessing, setIsProcessing] = useState(false); 
    const [imageRemoved, setImageRemoved] = useState(false); 

    const isFormValid = 
        formData.titulo.trim().length > 0 && formData.titulo.length <= 100 &&
        formData.descricao.trim().length > 0 && formData.descricao.length <= 100 &&
        formData.conteudo.trim().length > 0;

    useEffect(() => {
        if (isNew || !id) {
            setIsFetching(false);
            return;
        }

        async function loadPost() {
            setIsFetching(true);
            try {
                const post = await getPostById(id as string);

                setFormData({
                    titulo: post.titulo,
                    descricao: post.descricao,
                    conteudo: post.conteudo || '',
                    subjectName: post.subject.nome,
                    image: null,
                });

                if (post.image && post.image !== 'null') {
                    const imgUrl = `${import.meta.env.VITE_BASE_URL}${post.image}`;
                    setImagePreview(imgUrl);
                }
            } catch (error: unknown) {
                setToast({ message: 'Erro ao carregar a aula.', status: false });
            } finally {
                setIsFetching(false);
            }
        }
        loadPost();
    }, [id, isNew]);

    useEffect(() => {
        if (!toast) return;
        const timeout = window.setTimeout(() => setToast(null), 4000);
        return () => window.clearTimeout(timeout);
    }, [toast]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isFormValid) return;

        setIsProcessing(true);

        const postDataForm = new FormData();
        postDataForm.append('titulo', formData.titulo);
        postDataForm.append('descricao', formData.descricao);
        postDataForm.append('conteudo', formData.conteudo);
        postDataForm.append('subjectName', formData.subjectName);

        if (formData.image) {
            postDataForm.append('image', formData.image);
        } else if (!isNew && imageRemoved) {
            const emptyFile = new File([''], 'empty.jpg', { type: 'image/jpeg' });
            postDataForm.append('image', emptyFile);
        }

        try {
            if (isNew) {
                await createPost(postDataForm);
                navigate('/', { state: { toastMessage: 'Aula criada com sucesso!', toastStatus: true } });
            } else {
                if (typeof id !== 'string') throw new Error('ID inválido');
                await updatePost(id, postDataForm);
                navigate('/', { state: { toastMessage: 'Aula atualizada com sucesso!', toastStatus: true } });
            }
        } catch (error: unknown) {
            setIsProcessing(false); 
            setToast({ message: isNew ? 'Erro ao criar a aula.' : 'Erro ao editar a aula.', status: false });
        }
    }

    function handleRemoveSelectedImage() {
        if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
        setFormData({ ...formData, image: null });
        setImagePreview('');
        setImageRemoved(true); 
        if (imageInputRef.current) imageInputRef.current.value = '';
    }

    return (
        <>
            {isProcessing && (
                <Overlay>
                    <Spinner />
                    <LoadingText>{isNew ? 'Publicando aula...' : 'Salvando alterações...'}</LoadingText>
                </Overlay>
            )}

            {toast && <Toast $isSucess={toast.status}>{toast.message}</Toast>}

            <Main>
                <BackLink type="button" onClick={() => navigate('/')}>
                    <span className="material-symbols-outlined">arrow_upward</span>
                    Voltar a tela de início
                </BackLink>

                <TitleContainer>
                    <Title>{isNew ? 'Nova Aula' : 'Editar Aula'}</Title>
                    <TitleIcon src={redDoodle} alt="" />
                </TitleContainer>

                {isFetching ? (
                    <LoadingWrapper>
                        <Spinner />
                        <LoadingText>Carregando informações da aula...</LoadingText>
                    </LoadingWrapper>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <PhotoField>
                            <PhotoUpload $hasImage={Boolean(imagePreview)} htmlFor="image">
                                {imagePreview ? (
                                    <PhotoPreview src={imagePreview} alt="Capa da Aula" />
                                ) : (
                                    <UploadContent>
                                        <UploadIcon className="material-symbols-outlined">download</UploadIcon>
                                        <UploadText>
                                            Clique para carregar ou <br /> arraste e solte.
                                            <br />
                                            <OptionalText>(Opcional)</OptionalText>
                                        </UploadText>
                                    </UploadContent>
                                )}
                                <input
                                    ref={imageInputRef}
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={event => {
                                        const file = event.target.files?.[0] ?? null;
                                        setFormData({ ...formData, image: file });
                                        setImagePreview(file ? URL.createObjectURL(file) : '');
                                        if (file) setImageRemoved(false);
                                    }}
                                />
                            </PhotoUpload>
                            {imagePreview && (
                                <RemoveImageButton type="button" onClick={handleRemoveSelectedImage}>
                                    x
                                </RemoveImageButton>
                            )}
                        </PhotoField>

                        <Fields>
                            <Field htmlFor="titulo">
                                <LabelHeader>
                                    <span>Título<RequiredMark>*</RequiredMark></span>
                                    <CharCount $isNearLimit={formData.titulo.length >= 90}>
                                        {formData.titulo.length}/100
                                    </CharCount>
                                </LabelHeader>
                                <Input
                                    id="titulo"
                                    maxLength={100}
                                    value={formData.titulo}
                                    placeholder="Ex: Introdução à Mitose..."
                                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                />
                            </Field>

                            <Field htmlFor="subjectName">
                                <LabelHeader>
                                    <span>Matéria<RequiredMark>*</RequiredMark></span>
                                </LabelHeader>
                                <Select
                                    id="subjectName"
                                    value={formData.subjectName}
                                    onChange={e => setFormData({ ...formData, subjectName: e.target.value })}
                                >
                                  {Object.keys(materias).map((materia, i) => (
                                    <option key={i} value={materia}>{materia}</option>
                                  ))}
                                </Select>
                            </Field>

                            <Field htmlFor="descricao" $full>
                                <LabelHeader>
                                    <span>Descrição<RequiredMark>*</RequiredMark></span>
                                    <CharCount $isNearLimit={formData.descricao.length >= 90}>
                                        {formData.descricao.length}/100
                                    </CharCount>
                                </LabelHeader>
                                <Input
                                    id="descricao"
                                    maxLength={100}
                                    value={formData.descricao}
                                    placeholder="Ex: Nesta aula vamos aprender sobre..."
                                    onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                />
                            </Field>

                            <Field htmlFor="conteudo" $full>
                                <span>Conteúdo da Aula <RequiredMark>*</RequiredMark></span>
                                <Textarea
                                    id="conteudo"
                                    value={formData.conteudo}
                                    placeholder="Escreva todo o conteúdo da aula aqui..."
                                    onChange={e => setFormData({ ...formData, conteudo: e.target.value })}
                                />
                            </Field>
                        </Fields>

                        <Actions>
                            <Button type="button" $secondary onClick={() => navigate('/')} disabled={isProcessing}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={!isFormValid || isProcessing}>
                                {isNew ? 'Publicar Aula' : 'Atualizar Aula'}
                            </Button>
                        </Actions>
                    </Form>
                )}
            </Main>
        </>
    );
}