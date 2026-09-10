import axios from 'axios';
import { getLocalStorageToken } from '../utils/functions';
import { getBackendErrorMessage } from './auth.service';
import type { Comment } from '../types/Comment';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/api';

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
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

export async function updateComment(id: string, conteudo: string): Promise<void> {
  try {
    await axios.patch(`${BASE_URL}/post/comment/${id}`, 
      { conteudo }, 
      {
        headers: {
          Authorization: `Bearer ${getLocalStorageToken()}`,
        },
      }
    );
  } catch (error) {
    console.error(`Erro ao atualizar comentário ${id}:`, error);
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

export async function deleteComment(id: string): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/post/comment/${id}`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
  } catch (error) {
    console.error(`Erro ao deletar comentário ${id}:`, error);
    throw new Error(getBackendErrorMessage(error));
  }
}