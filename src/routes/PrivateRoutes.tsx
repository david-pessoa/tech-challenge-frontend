import { type ReactNode } from 'react';
import { useUser } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import type { Role } from '../types/Roles';

type PrivateRoutesProps = {
  children: ReactNode;
  acceptedRoles: Role[];
};

export default function PrivateRoute({ children, acceptedRoles }: PrivateRoutesProps) {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  
  //Se o usuário está carregando, exibe tela de carregamento
  if (isLoading) return <div>Carregando...</div>;

  // Se não consegue obter os dados do usuário, redireciona para o login
  if (!user) return <Navigate to="/login" replace />;

  // Caso o usuário esteja logado, mas não tenha permissão para acessar a rota, redireciona ele pra última página que visitou
  if (!acceptedRoles.includes(user.role)) {
    navigate(-1);
    return;
  }

  return children;
}
