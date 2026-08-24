import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import Header from '../components/Header';
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
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-decoration: none;

  span {
    color: #e6768d;
    font-size: 1.125rem;
    transform: rotate(-90deg);
  }
`;

const Title = styled.h1`
  text-align: center;
  margin: 0 0 3rem;
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
  gap: 0.35rem;
  width: 5.75rem;
  font-size: 0.68rem;
  line-height: 1.25;
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
  font-size: 0.875rem;
  font-weight: 600;
`;

const Input = styled.input`
  border: 0;
  border-radius: 1.5rem;
  background: #fbf6ea;
  box-shadow: 0 2px 5px #d8d0bf;
  color: ${({ theme }) => theme.colors.text};
  min-height: 2.75rem;
  padding: 0 1.25rem;

  &:focus {
    outline: 2px solid #f2c0ad;
  }
`;

const Select = styled.select`
  border: 0;
  border-radius: 1.5rem;
  background: #fbf6ea;
  box-shadow: 0 2px 5px #d8d0bf;
  color: ${({ theme }) => theme.colors.text};
  min-height: 2.75rem;
  padding: 0 1.25rem;

  &:focus {
    outline: 2px solid #f2c0ad;
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
  min-height: 2.25rem;
  min-width: 7rem;
  padding: 0 1.25rem;
`;

const Message = styled.p`
  grid-column: 2;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;

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

        <Title>{isNew ? 'Novo Usuário' : 'Editar Usuário'}</Title>

        <Form onSubmit={handleSubmit}>
          <PhotoField>
            <PhotoUpload $hasImage={Boolean(imagePreview)} htmlFor="image">
              {imagePreview ? (
                <PhotoPreview src={imagePreview} alt="Prévia da foto do usuário" />
              ) : (
                <UploadContent>
                  <UploadIcon className="material-symbols-outlined">download</UploadIcon>
                  Clique para carregar ou arraste e solte.
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
