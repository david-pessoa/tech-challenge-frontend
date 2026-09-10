import ErrorPage from './ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Página não encontrada"
      description="Não encontramos a página que você tentou acessar. Verifique o endereço ou volte para a tela inicial."
    />
  );
}
