import type { Role } from "./Roles";

type PostView = {
  nome: string;
  tipoUsuario: Role;
  viewedAt: Date;
}

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
    nome?: string
    tipoUsuario?: Role
  }
  foiVisto?: boolean;
  visualizacoes?: PostView[];
  dataCriacao: Date;
  dataModificacao: Date;
};
