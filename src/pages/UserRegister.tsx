import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import Header from '../components/Header';
import redDoodle from '../assets/red-doodle.png';
import type { Role } from '../types/Roles';

type UserRegisterProps = {
  isNew: boolean;
};

type UserFormData = {
  nome: string;
  matricula: string;
  role: Role;
  senha: string;
  confirmarSenha: string;
  image: File | null;
};

const initialFormData: UserFormData = {
  nome: '',
  matricula: '',
  role: 'ALUNO',
  senha: '',
  confirmarSenha: '',
  image: null,
};

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Main = styled.main`
  width: min(76rem, calc(100% - 2rem));
  margin: 0 auto 5rem;
`;

const BackLink = styled.a`
  color: ${({ theme }) => theme.colors.backLink};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.backLink.fontSize};
  font-weight: ${({ theme }) => theme.typography.backLink.fontWeight};
  margin-bottom: 1.5rem;
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
  line-height: ${({ theme }) => theme.typography.field.lineHeight};
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

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.fieldFocus};
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
`;

const Message = styled.p`
  grid-column: 2;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.field.fontWeight};

  @media (max-width: 720px) {
    grid-column: 1;
  }
`;

export default function UserRegister({ isNew }: UserRegisterProps) {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const currentRole: Role = 'ADMIN';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setMessage('As senhas não conferem.');
      return;
    }

    const token = localStorage.getItem('token');
    const userData = new FormData();

    userData.append('nome', formData.nome);
    userData.append('matricula', formData.matricula);
    userData.append('role', formData.role);
    userData.append('senha', formData.senha);

    if (formData.image) {
      userData.append('image', formData.image);
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: userData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage('Usuário cadastrado com sucesso.');
      setFormData(initialFormData);
      setImagePreview('');
    } catch {
      setMessage('Erro ao cadastrar usuário.');
    }
  }

  return (
    <>
      <Header role={currentRole} />

      <Main>
        <BackLink href="/">
          <span className="material-symbols-outlined">arrow_upward</span>
          Voltar a tela de início
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
                id="image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
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
          </PhotoField>

          <Fields>
            <Field $full htmlFor="nome">
              Nome
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                placeholder="Digite o nome completo..."
                onChange={event => setFormData({ ...formData, nome: event.target.value })}
              />
            </Field>

            <Field htmlFor="matricula">
              Matrícula
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
                onChange={event => setFormData({ ...formData, role: event.target.value as Role })}
              >
                <option value="ALUNO">Aluno</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ADMIN">Administrador</option>
              </Select>
            </Field>

            <Field htmlFor="senha">
              Senha
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                placeholder="Digite a senha..."
                onChange={event => setFormData({ ...formData, senha: event.target.value })}
              />
            </Field>

            <Field htmlFor="confirmarSenha">
              Confirme sua senha
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                placeholder="Confirme sua senha..."
                onChange={event =>
                  setFormData({ ...formData, confirmarSenha: event.target.value })
                }
              />
            </Field>
          </Fields>

          <Actions>
            <Button type="button" $secondary>
              Cancelar
            </Button>
            <Button type="submit">Enviar</Button>
          </Actions>

          {message && <Message>{message}</Message>}
        </Form>
      </Main>

      <Footer />
    </>
  );
}
