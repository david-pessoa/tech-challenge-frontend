import { type ReactNode } from 'react';
import { useUser } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Role } from '../types/Roles';

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; 
  width: 100%;
  background-color: #FFFCF7;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid #F6D4D9;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

type PrivateRoutesProps = {
  children: ReactNode;
  acceptedRoles: Role[];
};

export default function PrivateRoute({ children, acceptedRoles }: PrivateRoutesProps) {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <LoadingText>Verificando acessos...</LoadingText>
      </LoadingWrapper>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!acceptedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />; 
  }
  return <>{children}</>;
}