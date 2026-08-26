import axios from 'axios';
import { clearLocalStorageToken } from '../utils/functions';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/api';

export function getBackendErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; error?: unknown }
      | string
      | undefined;

    if (typeof data === 'string') return data;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.error === 'string') return data.error;

    if (error.response?.status === 500) {
      return 'Ocorreu um erro interno no servidor.';
    }
  }

  return 'Não foi possível concluir a operação.';
}

export async function login(matricula: string, password: string) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      matricula,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error('Erro de login:', error);
    throw new Error(getBackendErrorMessage(error))
  }
}

export async function logout() {
  clearLocalStorageToken();
}
