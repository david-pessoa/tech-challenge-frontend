import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import inicialImage from '../../public/inicialImage.png';
import { login } from '../services/auth.service';
import { setLocalStorageToken } from '../utils/functions';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUser } from '../context/AuthContext';

// Container que ocupa a tela inteira. position: relative é o que permite a
// imagem (position: absolute) se posicionar em relação a ele, cobrindo tudo.
const Wrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

// Imagem cobrindo a tela inteira, atrás do formulário (z-index: 1)
const Image = styled.img`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 85% center;
  display: block;

  /* No celular a imagem não aparece — só o formulário */
  @media (max-width: 600px) {
    display: none;
  }
`;

// Formulário, na frente da imagem (z-index: 2)
const FormBlock = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: clamp(1.5rem, 5vw, 3rem);
`;

// O card em si: aqui sim definimos uma largura máxima, pra ele não esticar
// e ficar legível. Como quem centraliza é o FormBlock (o pai), não precisamos
// de margin: auto aqui.
const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 420px;
  margin-top: -16vh; /* sobe o card em relação ao centro vertical */

  @media (max-width: 600px) {
    max-width: 340px;
    gap: 1.25rem;
  }
`;

// Selo "Fy" com fundo em degradê
const LogoBadge = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.primary}
  );
  color: #fffcf2;
  font-weight: 600;
  font-size: 1.125rem;
`;

const Greeting = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.125rem;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const Title = styled.h1`
  color: #8a4126;
  font-size: 2.25rem;
  margin-top: -0.375rem;

  @media (max-width: 600px) {
    font-size: 1.875rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
`;

// Wrapper do input: além de posicionar o ícone de mostrar/ocultar senha,
// carrega a animação de flutuação — assim campo e ícone sobem/descem juntos.
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Input com visual de "caixa" (fundo, borda e sombra suave).
// Padding à esquerda dá espaço pro ícone (usuário/cadeado); à direita,
// espaço extra só no campo de senha, por causa do ícone de mostrar/ocultar.
const Input = styled.input<{ $hasTrailingIcon?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid #fcbba3;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 0.625rem ${({ $hasTrailingIcon }) => ($hasTrailingIcon ? '2.5rem' : '0.875rem')} 0.625rem
    2.5rem;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 4px 14px rgba(252, 187, 163, 0.35);

  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Ícone decorativo à esquerda do campo (usuário ou cadeado)
const LeadingIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  display: flex;
  color: #fcbba3;
  pointer-events: none; /* não atrapalha o clique no campo */
`;

const ToggleVisibilityButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fcbba3;
`;

// Mensagem de erro (ex: "Matrícula ou senha inválidas"), só aparece
// quando existe algum erro pra mostrar
const ErrorMessage = styled.p`
  color: #c0392b;
  font-size: 0.9375rem;
  margin: 0;
`;

const LoginButton = styled.button`
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.75rem 2.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: 600;
  font-size: 1.0625rem;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }

  /* Enquanto está enviando o login, o botão fica meio transparente e
     o cursor muda, avisando que tem algo acontecendo */
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* No celular, o botão fica centralizado em vez de colado à esquerda */
  @media (max-width: 600px) {
    align-self: center;
  }
`;

export default function Login() {
  // Estados do formulário
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estados da chamada de login: erro pra mostrar na tela, e "carregando"
  // pra evitar clique duplo enquanto espera a resposta do back-end
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const {user, isLoading, refreshUser} = useUser();

  //Se o usuário está carregando, exibe tela de carregamento
  if (isLoading) return <div>Carregando...</div>;

  // Se o usuário está logado, sai do login
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const resposta = await login(matricula, senha);
      setLocalStorageToken(resposta.token);
      // Login deu certo: manda a pessoa pra tela inicial. Usamos um
      // reload de verdade (em vez do navigate do react-router) porque
      // o UserProvider só busca os dados do usuário logado uma vez,
      // quando a aplicação carrega — o reload garante que ele rode de
      // novo já com o token salvo.
      await refreshUser()
      navigate('/')
    } catch (error) {
      // login() do auth.service já devolve uma mensagem de erro tratada
      // (ex: "Matrícula ou senha inválidas"), então só precisamos exibi-la.
      setErro(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Wrapper>
      <FormBlock>
        <CardInner>
          <LogoBadge>Fy</LogoBadge>
          <div>
            <Greeting>Bem vindo(a) ao</Greeting>
            <br />
            <Title>Edify</Title>
          </div>

          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="matricula">Matrícula</Label>
              <InputWrapper>
                <LeadingIcon aria-hidden="true">
                  <span className="material-symbols-outlined">person</span>
                </LeadingIcon>
                <Input
                  id="matricula"
                  name="matricula"
                  type="text"
                  placeholder="Sua matrícula..."
                  value={matricula}
                  onChange={event => setMatricula(event.target.value)}
                  required
                />
              </InputWrapper>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="senha">Senha</Label>
              <InputWrapper>
                <LeadingIcon aria-hidden="true">
                  <span className="material-symbols-outlined">lock</span>
                </LeadingIcon>
                <Input
                  $hasTrailingIcon
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Sua senha..."
                  value={senha}
                  onChange={event => setSenha(event.target.value)}
                  required
                />
                <ToggleVisibilityButton
                  type="button"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setMostrarSenha(anterior => !anterior)}
                >
                  <span className="material-symbols-outlined">
                    {mostrarSenha ? 'visibility_off' : 'visibility'}
                  </span>
                </ToggleVisibilityButton>
              </InputWrapper>
            </FieldGroup>

            {erro && <ErrorMessage role="alert">{erro}</ErrorMessage>}

            <LoginButton type="submit" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Login'}
            </LoginButton>
          </Form>
        </CardInner>
      </FormBlock>

      <Image src={inicialImage} alt="Alunas estudando em sala de aula" />
    </Wrapper>
  );
}
