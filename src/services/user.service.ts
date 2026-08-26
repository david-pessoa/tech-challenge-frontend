import axios from 'axios';
import { getLocalStorageToken } from '../utils/functions';
import { getBackendErrorMessage } from './auth.service';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/api';

export async function getAllUsers() {
  try {
    const response = await axios.get(`${BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de lista de usuários:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function createUser(user: FormData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user`,
      user,
      {
        headers: {
          Authorization: `Bearer ${getLocalStorageToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro na criação de usuário:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function updateUser(id: string, user: FormData) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/user/${id}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${getLocalStorageToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro na atualização de usuários:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na remoção de usuários:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

export async function getMe() {
  try {
    const response = await axios.get(`${BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${getLocalStorageToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro na obtenção de dados do usuário logado:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}
