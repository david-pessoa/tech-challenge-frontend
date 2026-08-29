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
    nome: string
    tipoUsuario: Role
  }
  dataCriacao: Date;
  dataModificacao: Date;
};
