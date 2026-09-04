import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import redDoodle from '../assets/red-doodle.png';
import { createPost, getPostById, updatePost } from '../services/post.service';

type PostEditorProps = {
    isNew: boolean;
};

type ToastStatus = 'success' | 'error';

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
  min-height: 40vh; /* Mantém o spinner centralizado no meio da tela */
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

const Toast = styled.div<{ $status: ToastStatus }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  width: min(22rem, calc(100% - 2rem));
  border-left: 0.35rem solid ${({ $status, theme }) => ($status === 'success' ? '#6FB9A9' : theme.colors.primary)};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.fieldBackground};
  box-shadow: 0 0.5rem 1.5rem rgba(50, 67, 77, 0.16);
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem 1.25rem;
`;

export default function PostEditor({ isNew }: PostEditorProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<PostFormData>(initialFormData);
    const [imagePreview, setImagePreview] = useState('');
    const [toast, setToast] = useState<{ message: string; status: ToastStatus } | null>(null);
    
    const [isFetching, setIsFetching] = useState(!isNew); 
    const [isProcessing, setIsProcessing] = useState(false); 

    const isFormValid = Boolean(formData.titulo.trim()) && Boolean(formData.descricao.trim()) && Boolean(formData.conteudo.trim());

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
                    subjectName: post.materia,
                    image: null,
                });

                if (post.image) {
                    const imgUrl = `${import.meta.env.VITE_BASE_URL}${post.image}`;
                    setImagePreview(imgUrl);
                }
            } catch (error: unknown) {
                setToast({ message: 'Erro ao carregar a aula.', status: 'error' });
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

        setIsProcessing(true);

        const postDataForm = new FormData();
        postDataForm.append('titulo', formData.titulo);
        postDataForm.append('descricao', formData.descricao);
        postDataForm.append('conteudo', formData.conteudo);
        postDataForm.append('subjectName', formData.subjectName);

        if (formData.image) {
            postDataForm.append('image', formData.image);
        }

        try {
            if (isNew) {
                await createPost(postDataForm);
                navigate('/', { state: { toastMessage: 'Aula criada com sucesso!', toastStatus: 'success' } });
            } else {
                if (typeof id !== 'string') throw new Error('ID inválido');
                await updatePost(id, postDataForm);
                navigate('/', { state: { toastMessage: 'Aula atualizada com sucesso!', toastStatus: 'success' } });
            }
        } catch (error: unknown) {
            setIsProcessing(false); 
            setToast({ message: isNew ? 'Erro ao criar a aula.' : 'Erro ao editar a aula.', status: 'error' });
        }
    }

    function handleRemoveSelectedImage() {
        if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
        setFormData({ ...formData, image: null });
        setImagePreview('');
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

            {toast && <Toast $status={toast.status}>{toast.message}</Toast>}

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
                                <span>Título da Aula <RequiredMark>*</RequiredMark></span>
                                <Input
                                    id="titulo"
                                    value={formData.titulo}
                                    placeholder="Ex: Introdução à Mitose..."
                                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                />
                            </Field>

                            <Field htmlFor="subjectName">
                                <span>Matéria<RequiredMark>*</RequiredMark></span>
                                <Select
                                    id="subjectName"
                                    value={formData.subjectName}
                                    onChange={e => setFormData({ ...formData, subjectName: e.target.value })}
                                >
                                    <option value="Geral">Geral</option>
                                    <option value="Português">Português</option>
                                    <option value="Matemática">Matemática</option>
                                    <option value="Geografia">Geografia</option>
                                    <option value="História">História</option>
                                    <option value="Ciências">Ciências</option>
                                    <option value="Ensino Religioso">Ensino Religioso</option>
                                </Select>
                            </Field>

                            <Field htmlFor="descricao" $full>
                                <span>Descrição<RequiredMark>*</RequiredMark></span>
                                <Input
                                    id="descricao"
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