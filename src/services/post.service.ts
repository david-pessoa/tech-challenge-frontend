import axios from 'axios';
import type { Post } from '../types/Posts';
import { getLocalStorageToken } from '../utils/functions';
import { getBackendErrorMessage } from './auth.service';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/api';

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await axios.get(`${BASE_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    
    return response.data.map((item: any) => ({
      postId: item.postId,
      materia: item.subject.nome,
      titulo: item.titulo,
      descricao: item.descricao,
      autor: item.criadoPor.nome,
      createdAt: new Date(item.dataCriacao),
      editedAt: new Date(item.dataModificacao),
      conteudo: item.conteudo,
      image: item.image,
      criadoPor: {
        nome: item.criadoPor.nome,
        tipoUsuario: item.criadoPor.tipoUsuario,
        image: item.criadoPor.image,
      },
    }));
  } catch (error) {
    console.error('Erro na obtenção da lista de posts:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function getPostById(id: string): Promise<Post> {
  try {
    const posts = await getPosts();
    const post = posts.find((p) => p.postId === id);
    
    if (!post) {
      throw new Error('Post não encontrado');
    }
    
    return post;
  } catch (error) {
    console.error(`Erro na obtenção do post ${id}:`, error);
    throw error;
  }
}