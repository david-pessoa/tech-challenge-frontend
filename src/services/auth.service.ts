import axios from 'axios';
import { clearLocalStorageToken } from '../utils/functions';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/api';

export async function login(matricula: string, password: string) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      matricula,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error('Erro de login:', error);
    return error;
  }
}

export async function logout() {
  clearLocalStorageToken();
}
