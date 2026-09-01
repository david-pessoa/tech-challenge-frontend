import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { useUser } from '../context/AuthContext';
import redDoodle from '../assets/red-doodle.png';
import type { Role } from '../types/Roles';
import { createUser, getAllUsers, getUserById, updateUser } from '../services/user.service';
import { buildApiImageUrl } from '../utils/functions';
import type { User } from '../types/User';

type UserRegisterProps = {
  isNew: boolean;
};

type ToastStatus = 'success' | 'error';

type UserFormData = {
  nome: string;
  birthDate: Date | null;
  matricula: string;
  role: Role;
  senha: string;
  confirmarSenha: string;
  image: File | null;
};

const initialFormData: UserFormData = {
  nome: '',
  birthDate: null,
  matricula: '',
  role: 'ALUNO',
  senha: '',
  confirmarSenha: '',
  image: null,
};

const Main = styled.main`
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto 5rem;
  padding: 0 clamp(1rem, 8.55vw, 7.6875rem);
`;

const BackLink = styled.button`
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.backLink};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.backLink.fontSize};
  font-weight: ${({ theme }) => theme.typography.backLink.fontWeight};
  margin-bottom: 1.5rem;
  padding: 0;
  text-decoration: none;

  span {
    color: ${({ theme }) => theme.colors.backIcon};
    font-size: 1.125rem;
    transform: rotate(-90deg);
  }
`;

const Title = styled.h1`
  text-align: center;
  margin: 0;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 3rem;
`;

const TitleIcon = styled.img`
  width: 4rem;
  margin-left: -1.2rem;
  transform: translateY(-0.65rem) rotate(12deg);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 2.5rem;
  align-items: start;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PhotoField = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const PhotoUpload = styled.label<{ $hasImage: boolean }>`
  position: relative;
  width: 8.75rem;
  height: 8.75rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  background-color: ${({ $hasImage }) => ($hasImage ? 'transparent' : 'rgba(251, 220, 220, 0.24)')};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${({ $hasImage, theme }) =>
      $hasImage
        ? 'transparent'
        : `repeating-conic-gradient(${theme.colors.primary} 0deg 12deg, transparent 12deg 30deg)`};
    mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px));
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 2px),
      #000 calc(100% - 2px)
    );
  }

  input {
    display: none;
  }
`;

const PhotoPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadContent = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 6.25rem;
  color: ${({ theme }) => theme.colors.uploadText};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.uploadHint.fontSize};
  font-weight: ${({ theme }) => theme.typography.uploadHint.fontWeight};
  line-height: ${({ theme }) => theme.typography.uploadHint.lineHeight};
`;

const UploadIcon = styled.span`
  font-size: 1.8rem;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -0.125rem;
  left: 0.875rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: grid;
  place-items: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  padding: 0;
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.5rem 1.25rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const NameDateRow = styled.div`
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: minmax(0, 1fr) minmax(10.5rem, 14rem);
  gap: 1.25rem;

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
  line-height: ${({ theme }) => theme.typography.field.lineHeight};
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
  line-height: ${theme.typography.field.lineHeight};
  min-height: 2.75rem;
  padding: 0 1.25rem;

  &::placeholder {
    color: ${theme.colors.fieldPlaceholder};
    opacity: 1;
  }
`;

const Input = styled.input`
  ${fieldControlStyles}

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.fieldFocus};
  }
`;

const Select = styled.select`
  ${fieldControlStyles}
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, #98816d 50%),
    linear-gradient(135deg, #98816d 50%, transparent 50%);
  background-position:
    calc(100% - 1.65rem) 50%,
    calc(100% - 1.3rem) 50%;
  background-repeat: no-repeat;
  background-size:
    0.38rem 0.38rem,
    0.38rem 0.38rem;
  cursor: pointer;
  padding-right: 3.25rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.fieldFocus};
  }

  &:disabled {
    background-image: none;
    cursor: default;
  }

  option {
    background-color: ${({ theme }) => theme.colors.fieldBackground};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.field.fontSize};
    font-weight: ${({ theme }) => theme.typography.field.fontWeight};
    padding: 0.75rem 1rem;
  }
`;

const PasswordInputWrapper = styled.div`
  ${fieldControlStyles}
  display: flex;
  align-items: center;
  padding-right: 1rem;

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.fieldFocus};
  }
`;

const FieldError = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
`;

const PasswordInput = styled.input`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.field.fontSize};
  font-weight: ${({ theme }) => theme.typography.field.fontWeight};
  line-height: ${({ theme }) => theme.typography.field.lineHeight};
  min-width: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.fieldPlaceholder};
    opacity: 1;
  }
`;

const PasswordVisibilityButton = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.passwordIcon};
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 0;

  span {
    font-size: ${({ theme }) => theme.typography.passwordIcon.fontSize};
    font-variation-settings: 'FILL' 1;
  }
`;

const Actions = styled.div`
  grid-column: 2;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 720px) {
    grid-column: 1;
  }
`;

const Button = styled.button<{ $secondary?: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 1.25rem;
  background: ${({ $secondary, theme }) => ($secondary ? 'transparent' : theme.colors.primary)};
  color: ${({ $secondary, theme }) => ($secondary ? theme.colors.primary : '#fff')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.field.fontSize};
  font-weight: 400;
  min-height: 2.25rem;
  min-width: 7rem;
  padding: 0 1.25rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Toast = styled.div<{ $status: ToastStatus }>`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
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

const ToastCloseButton = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: inline-flex;
  padding: 0;

  span {
    font-size: 1.25rem;
    line-height: 1;
  }
`;

export default function UserRegister({ isNew }: UserRegisterProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: loggedUser } = useUser();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState('');
  const [toast, setToast] = useState<{ message: string; status: ToastStatus } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasPasswordMismatch =
    Boolean(formData.senha) &&
    Boolean(formData.confirmarSenha) &&
    formData.senha !== formData.confirmarSenha;
  const hasRequiredPasswordFields = isNew
    ? Boolean(formData.senha.trim()) && Boolean(formData.confirmarSenha.trim())
    : !formData.senha || Boolean(formData.confirmarSenha.trim());
  const isFormValid =
    Boolean(formData.nome.trim()) &&
    Boolean(formData.matricula.trim()) &&
    hasRequiredPasswordFields &&
    !hasPasswordMismatch;
  const isProfessor = loggedUser?.role === 'PROFESSOR';
  const cameFromUserList = (location.state as { from?: string } | null)?.from === 'user-list';
  const backButtonText = cameFromUserList ? 'Voltar para listagem' : 'Voltar a tela de início';

  document.title = isNew ? 'Edify | Cadastro de Usuários' : 'Edify | Edição de Usuários';

  useEffect(() => {
    if (isProfessor) {
      setFormData(currentFormData => ({
        ...currentFormData,
        role: 'ALUNO',
      }));
    }
  }, [isProfessor]);

  useEffect(() => {
    if (isNew || !id) {
      return;
    }

    async function loadUser() {
      try {
        if (typeof id !== 'string') throw new Error('ID de usuário inválido');
        const user = (await getUserById(id)) as User;

        setFormData({
          nome: user.nome,
          birthDate: user.birthDate ? new Date(user.birthDate) : null,
          matricula: user.matricula,
          role: user.role,
          senha: '',
          confirmarSenha: '',
          image: null,
        });
        const userImageUrl = buildApiImageUrl(user.image ?? null);
        setImagePreview(userImageUrl);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar usuário.';

        setToast({ message, status: 'error' });
      }
    }

    loadUser();
  }, [id]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 4000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setToast({ message: 'As senhas não conferem.', status: 'error' });
      return;
    }

    try {
      if (!isNew) {
        const users = (await getAllUsers()) as User[];
        const hasDuplicatedRegistration = users.some(
          user => user.matricula === formData.matricula.trim() && user.id !== id
        );

        if (hasDuplicatedRegistration) {
          setToast({ message: 'Já existe um usuário cadastrado com essa matrícula.', status: 'error' });
          return;
        }
      }

      const userData = new FormData();

      userData.append('nome', formData.nome);
      if (formData.birthDate) {
        userData.append('birthDate', formData.birthDate.toISOString().split('T')[0]);
      }
      userData.append('matricula', formData.matricula);
      userData.append('role', formData.role);

      if (isNew || formData.senha) {
        userData.append('senha', formData.senha);
      }

      if (formData.image) {
        userData.append('image', formData.image);
      }

      let successMessage;

      if (isNew) {
        await createUser(userData);
        successMessage = 'Usuário cadastrado com sucesso.';
      } else {
        if (typeof id !== 'string') throw new Error('ID de usuário inválido');
        await updateUser(id, userData);
        successMessage = 'Usuário editado com sucesso.';
      }

      navigate('/user/list', { state: { toastMessage: successMessage } });
    } catch (error: unknown) {
      let defaultMessage;
      if (isNew) defaultMessage = 'Erro ao cadastrar usuário.';
      else defaultMessage = 'Erro ao editar usuário';
      const message = error instanceof Error ? error.message : defaultMessage;

      setToast({ message, status: 'error' });
    }
  }

  function handleRemoveSelectedImage() {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData({
      ...formData,
      image: null,
    });
    setImagePreview('');

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }

  function handleGoBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  }

  return (
    <>
      {toast && (
        <Toast $status={toast.status}>
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

      <Header />

      <Main>
        <BackLink type="button" onClick={handleGoBack}>
          <span className="material-symbols-outlined">arrow_upward</span>
          {backButtonText}
        </BackLink>

        <TitleContainer>
          <Title>{isNew ? 'Novo Usuário' : 'Editar Usuário'}</Title>
          <TitleIcon src={redDoodle} alt="" />
        </TitleContainer>

        <Form onSubmit={handleSubmit}>
          <PhotoField>
            <PhotoUpload $hasImage={Boolean(imagePreview)} htmlFor="image">
              {imagePreview ? (
                <PhotoPreview src={imagePreview} alt="Prévia da foto do usuário" />
              ) : (
                <UploadContent>
                  <UploadIcon className="material-symbols-outlined">download</UploadIcon>
                  <span>Clique para carregar ou arraste e solte.</span>
                </UploadContent>
              )}
              <input
                ref={imageInputRef}
                id="image"
                name="image"
                type="file"
                accept="image/png"
                onChange={event => {
                  const file = event.target.files?.[0] ?? null;

                  setFormData({
                    ...formData,
                    image: file,
                  });
                  setImagePreview(file ? URL.createObjectURL(file) : '');
                }}
              />
            </PhotoUpload>
            {imagePreview && (
              <RemoveImageButton
                type="button"
                aria-label="Remover imagem selecionada"
                onClick={handleRemoveSelectedImage}
              >
                x
              </RemoveImageButton>
            )}
          </PhotoField>

          <Fields>
            <NameDateRow>
              <Field htmlFor="nome">
                <span>
                  Nome Completo <RequiredMark>*</RequiredMark>
                </span>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  placeholder="Digite o nome completo..."
                  onChange={event => setFormData({ ...formData, nome: event.target.value })}
                />
              </Field>

              <Field htmlFor="birthDate">
                Data de nascimento
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={
                    formData.birthDate
                      ? formData.birthDate.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={event =>
                    setFormData({
                      ...formData,
                      birthDate: event.target.value
                        ? new Date(`${event.target.value}T00:00:00`)
                        : null,
                    })
                  }
                />
              </Field>
            </NameDateRow>

            <Field htmlFor="matricula">
              <span>
                Matrícula <RequiredMark>*</RequiredMark>
              </span>
              <Input
                id="matricula"
                name="matricula"
                value={formData.matricula}
                placeholder="Digite a matrícula..."
                onChange={event => setFormData({ ...formData, matricula: event.target.value })}
              />
            </Field>

            <Field htmlFor="role">
              Selecione o tipo de acesso
              <Select
                id="role"
                name="role"
                value={formData.role}
                disabled={isProfessor}
                onChange={event => setFormData({ ...formData, role: event.target.value as Role })}
              >
                {isProfessor ? (
                  <option value="ALUNO">Aluno</option>
                ) : (
                  <>
                    <option value="ALUNO">Aluno</option>
                    <option value="PROFESSOR">Professor</option>
                    <option value="ADMIN">Administrador</option>
                  </>
                )}
              </Select>
            </Field>

            <Field htmlFor="senha">
              <span>
                Senha <RequiredMark>*</RequiredMark>
              </span>
              <PasswordInputWrapper>
                <PasswordInput
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  placeholder="Digite a senha..."
                  onChange={event => setFormData({ ...formData, senha: event.target.value })}
                />
                <PasswordVisibilityButton
                  type="button"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword(previous => !previous)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </PasswordVisibilityButton>
              </PasswordInputWrapper>
              {hasPasswordMismatch && <FieldError>As senhas não conferem.</FieldError>}
            </Field>

            <Field htmlFor="confirmarSenha">
              <span>
                Confirme sua senha <RequiredMark>*</RequiredMark>
              </span>
              <PasswordInputWrapper>
                <PasswordInput
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmarSenha}
                  placeholder="Confirme sua senha..."
                  onChange={event =>
                    setFormData({ ...formData, confirmarSenha: event.target.value })
                  }
                />
                <PasswordVisibilityButton
                  type="button"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowConfirmPassword(previous => !previous)}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </PasswordVisibilityButton>
              </PasswordInputWrapper>
            </Field>
          </Fields>

          <Actions>
            <Button type="button" $secondary onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              {isNew ? 'Salvar' : 'Atualizar'}
            </Button>
          </Actions>
        </Form>
      </Main>

      <Footer />
    </>
  );
}
