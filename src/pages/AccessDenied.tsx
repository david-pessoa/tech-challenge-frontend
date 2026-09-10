import ErrorPage from './ErrorPage';

export default function AccessDenied() {
  return (
    <ErrorPage
      code="403"
      title="Acesso não permitido"
      description="Seu usuário não tem permissão para acessar esta página."
    />
  );
}
