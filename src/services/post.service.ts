import { api } from './api';

import type { Post } from '../types/Posts';
import { getBackendErrorMessage } from './auth.service';

export async function getAllPosts() {
  try {
    const response = await api.get<Post[]>('/posts');
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de lista de posts:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function createPost(post: any) {
  try {
    const response = await api.post('/posts', post);
    return response.data;
  } catch (error) {
    console.error('Erro na criação de posts:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function getPostById(id: string) {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de post pelo ID:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function updatePost(id: string, post: any) {
  try {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  } catch (error) {
    console.error('Erro na atualização de post:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function deletePost(id: string) {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro na deletar um post:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function searchPost(text: string) {
  try {
    const response = await api.get('/posts/search', {
      params: {
        termo: text
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na deletar um post:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}
