import ErrorPage from './ErrorPage';

export default function ServiceUnavailable() {
  return (
    <ErrorPage
      code="503"
      title="Serviço indisponível"
      description="Não foi possível acessar o serviço no momento. Tente novamente em instantes."
    />
  );
}
