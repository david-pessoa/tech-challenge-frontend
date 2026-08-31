import type { Role } from "./Roles";

export type Post = {
  postId: string;
  subject: {
    id: string;
    nome: string;
  }
  titulo: string;
  descricao: string;
  criadoPor: {
    userId: string;
    nome: string
    tipoUsuario: Role
  }
  foiVisto: boolean;
  dataCriacao: Date;
  dataModificacao: Date;
};
