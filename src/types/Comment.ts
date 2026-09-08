export type Comment = {
  id: string;
  childComment: {
    id: string;
    conteudo: string;
    dataCriacao: string;
    dataModificacao: string;
    image?: string;
  } | null;
  user: string;
  conteudo: string;
  dataCriacao: string;
  dataModificacao: string;
  image?: string; 
};