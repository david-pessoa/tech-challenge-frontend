import axios from 'axios';

import type { Post } from '../types/Posts';
import { getLocalStorageToken } from '../utils/functions';
import { getBackendErrorMessage } from './auth.service';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/api';

export async function getAllPosts() {
  try {
    const response = await axios.get<Post[]>(`${BASE_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de lista de posts:', error);
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

export async function getPostById(id: string) {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de post pelo ID:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}


export async function deletePost(id: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na deletar um post:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function searchPost(text: string) {
  try {
    const response = await axios.get(`${BASE_URL}/posts/search`, {
      params: {
        termo: text
      },
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na deletar um post:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}
