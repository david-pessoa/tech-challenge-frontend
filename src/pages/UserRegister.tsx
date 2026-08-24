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
  width: min(75rem, calc(100% - 2rem));
  margin: 0 auto 4rem;
`;

const Title = styled.h1`
  text-align: center;
  margin: 2rem 0;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 2rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const PhotoField = styled.div`
  display: flex;
  justify-content: center;
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${({ $full }) => ($full ? '1 / -1' : 'auto')};
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

export default function UserRegister({ isNew }: UserRegisterProps) {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
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
    } catch {
      setMessage('Erro ao cadastrar usuário.');
    }
  }

  return (
    <>
      <Header role={currentRole} />

      <Main>
        <a href="/">Voltar a tela de início</a>

        <Title>{isNew ? 'Novo Usuário' : 'Editar Usuário'}</Title>

        <Form onSubmit={handleSubmit}>
          <PhotoField>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={event =>
                setFormData({
                  ...formData,
                  image: event.target.files?.[0] ?? null,
                })
              }
            />
          </PhotoField>

          <Fields>
            <Field $full htmlFor="nome">
              Nome
              <input
                id="nome"
                name="nome"
                value={formData.nome}
                placeholder="Digite o nome completo..."
                onChange={event => setFormData({ ...formData, nome: event.target.value })}
              />
            </Field>

            <Field htmlFor="matricula">
              Matrícula
              <input
                id="matricula"
                name="matricula"
                value={formData.matricula}
                placeholder="Digite a matrícula..."
                onChange={event => setFormData({ ...formData, matricula: event.target.value })}
              />
            </Field>

            <Field htmlFor="role">
              Selecione o tipo de acesso
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={event => setFormData({ ...formData, role: event.target.value as Role })}
              >
                <option value="ALUNO">Aluno</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </Field>

            <Field htmlFor="senha">
              Senha
              <input
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
              <input
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
            <button type="button">Cancelar</button>
            <button type="submit">Enviar</button>
          </Actions>

          {message && <p>{message}</p>}
        </Form>
      </Main>

      <Footer />
    </>
  );
}
