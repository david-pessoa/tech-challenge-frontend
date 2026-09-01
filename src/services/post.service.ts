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
