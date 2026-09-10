import { Link } from 'react-router-dom';
import styled from 'styled-components';

type ErrorPageProps = {
  code: '404' | '503' | '403';
  title: string;
  description: string;
};

const Wrapper = styled.main`
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  min-height: 100vh;
  justify-content: center;
  padding: 2rem;
`;

const Content = styled.section`
  max-width: 36rem;
  text-align: center;
`;

const Code = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: clamp(4rem, 16vw, 8rem);
  font-weight: 600;
  line-height: 1;
  margin: 0 0 1rem;
`;

const Title = styled.h1`
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  line-height: 1.1;
  margin: 0 0 1rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.uploadText};
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 auto 2rem;
`;

const HomeLink = styled(Link)`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: #fff;
  display: inline-flex;
  font-weight: 600;
  min-height: 2.5rem;
  align-items: center;
  padding: 0 1.5rem;
  text-decoration: none;
`;

export default function ErrorPage({ code, title, description }: ErrorPageProps) {
  document.title = `Edify | Erro ${code}`;

  return (
    <Wrapper>
      <Content>
        <Code>{code}</Code>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <HomeLink to="/">Voltar para a página inicial</HomeLink>
      </Content>
    </Wrapper>
  );
}
