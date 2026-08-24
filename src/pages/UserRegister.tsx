import { useState } from 'react';
import type { FormEvent } from 'react';
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

export default function UserRegister({ isNew }: UserRegisterProps) {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main>
      <a href="/">Voltar a tela de início</a>

      <h1>{isNew ? 'Novo Usuário' : 'Editar Usuário'}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="image">Foto</label>
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

        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          name="nome"
          value={formData.nome}
          placeholder="Digite o nome completo..."
          onChange={event => setFormData({ ...formData, nome: event.target.value })}
        />

        <label htmlFor="matricula">Matrícula</label>
        <input
          id="matricula"
          name="matricula"
          value={formData.matricula}
          placeholder="Digite a matrícula..."
          onChange={event => setFormData({ ...formData, matricula: event.target.value })}
        />

        <label htmlFor="role">Selecione o tipo de acesso</label>
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

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          value={formData.senha}
          placeholder="Digite a senha..."
          onChange={event => setFormData({ ...formData, senha: event.target.value })}
        />

        <label htmlFor="confirmarSenha">Confirme sua senha</label>
        <input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          placeholder="Confirme sua senha..."
          onChange={event => setFormData({ ...formData, confirmarSenha: event.target.value })}
        />

        <button type="button">Cancelar</button>
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
}
