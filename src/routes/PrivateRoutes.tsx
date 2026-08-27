import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getLocalStorageToken } from '../utils/functions';

type PrivateRoutesProps = {
  children: ReactNode;
};

// Só deixa passar quem estiver autenticado (tem token salvo).
// Sem isso, qualquer pessoa poderia acessar /home, /post/new etc.
// digitando a URL direto, mesmo sem ter feito login.
export default function PrivateRoute({ children }: PrivateRoutesProps) {
  const token = getLocalStorageToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
