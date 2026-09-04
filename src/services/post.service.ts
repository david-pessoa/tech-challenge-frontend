import axios from 'axios';
import type { Post , CommentAPI } from '../types/Posts';
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

export async function deletePost(id: string): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
  } catch (error) {
    console.error(`Erro ao deletar o post ${id}:`, error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function createPost(postData: FormData): Promise<void> {
  try {
    await axios.post(`${BASE_URL}/posts`, postData, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
        'Content-Type': 'multipart/form-data', 
      },
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function updatePost(id: string, postData: FormData): Promise<void> {
  try {
    await axios.put(`${BASE_URL}/posts/${id}`, postData, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error(`Erro ao atualizar post ${id}:`, error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function createComment(postId: string, comentario: string, parentCommentId?: string): Promise<void> {
  try {
    const payload = parentCommentId 
      ? { conteudo: comentario, parentCommentId } 
      : { conteudo: comentario };

    await axios.post(`${BASE_URL}/post/comment/${postId}`, payload, {
        headers: {
          Authorization: `Bearer ${getLocalStorageToken()}`,
        },
      }
    );
  } catch (error) {
    console.error(`Erro ao enviar comentário no post ${postId}:`, error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function getCommentsByPostId(postId: string): Promise<CommentAPI[]> {
  try {
    const response = await axios.get(`${BASE_URL}/post/comment/list/${postId}`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar comentários do post ${postId}:`, error);
    return []; 
  }
}