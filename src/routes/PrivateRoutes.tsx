import { type ReactNode } from 'react';
import { useUser } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import type { Role } from '../types/Roles';

type PrivateRoutesProps = {
  children: ReactNode;
  acceptedRoles: Role[];
};

export default function PrivateRoute({ children, acceptedRoles }: PrivateRoutesProps) {
  const { user, isLoading } = useUser();

  if (!isLoading) {
    if (!user) return <Navigate to="/login" replace />;

    if (!acceptedRoles.includes(user.role)) return <Navigate to="/home" replace />;
  }

  return children;
}
