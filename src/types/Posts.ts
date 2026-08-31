import type { Role } from "./Roles";

export type Post = {
  postId: string;
  materia: string;
  titulo: string;
  descricao: string;
  autor: string;
  createdAt: Date;
  editedAt: Date;
  conteudo?: string; 
  image?: string; 
  criadoPor?: {
    nome: string;
    tipoUsuario: Role;
    image: string | null;
  };
};