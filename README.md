# Edify — Front-end

Aplicação web educacional para organizar e consultar aulas publicadas por professores.
O sistema oferece experiências diferentes para administradores, professores e alunos,
com layout responsivo e integração com uma API REST.

## Problema

Informações de aulas, usuários e atividades podem ficar dispersas e difíceis de encontrar
em uma rotina escolar. Além disso, cada perfil precisa ter permissões adequadas para
visualizar ou administrar esse conteúdo.

## Solução

Foi construído um front-end em React para centralizar o acesso às aulas e aos usuários da
escola. A aplicação possui login, proteção de rotas por perfil, busca de posts, visualização
de aulas, gerenciamento de usuários e uma interface adaptada a diferentes tamanhos de tela.

## Responsabilidades

O escopo deste repositório é o front-end da aplicação. As responsabilidades cobertas por ele
são:

### David
- Desenvolvimento dos componentes da Tela Inicial
- Integração do front-end aos endpoints de autenticação, posts e usuários.
- Implementação da busca de posts com debounce e apresentação de resultados.
- Desenvolvimento das tabelas e carrosséis para exibição dos posts
- Desenvolvimento de modais de confirmação de remoção de post
- Documentação

### Michele
 - Desenvolvimento da tela de listagem de usuários
 - Desenvolvimento da tela de criação/edição de usuários
 - Desenvolvimento de modais de confirmação de exclusão de usuário, mensagens de erro e feedbacks de operação.
 - Criação de testes unitários
 - Desenvolvimento das páginas de erro 404, 503 e acesso não permitido
 - Documentação

### Beatriz
- Desenvolvimento da tela de leitura de post
- Desenvolvimento da tela de criação/edição de post
- Integração do front-end aos endpoints de comentários de post
- Implementação da funcionalidade de comentários em posts
- Criação de tela de carregamento
- Documentação
- Subida para produção

### Victor
- Desenvolvimento da tela de login
- Implementação da lógica de autenticação

## Funcionalidades

- Login por matrícula e senha.
- Sessão de autenticação mantida por cookie `HttpOnly` emitido pelo back-end.
- Recuperação do usuário autenticado por meio do endpoint `/user/me`.
- Proteção de rotas e autorização por perfil: `ADMIN`, `PROFESSOR` e `ALUNO`.
- Página inicial com perfil, aulas, calendário e lista resumida de usuários.
- Busca de aulas por texto, com atraso de 300 ms para reduzir requisições durante a digitação.
- Exibição de aulas novas em carrossel.
- Listagem de aulas visualizadas e gerenciamento de posts conforme o perfil.
- Listagem completa de usuários, agrupada por tipo de acesso.
- Cadastro e edição de usuários com nome, matrícula, data de nascimento, senha, perfil e imagem.
- Upload e pré-visualização de foto de usuário nos formatos PNG e JPEG.
- Exclusão de usuários e posts com confirmação por modal.
- Interface responsiva para desktop, tablet e celular.
- Mensagens de sucesso e erro para operações de usuário e tratamento padronizado de erros da API.

## Tecnologias

- React 19
- TypeScript 6
- Vite 8
- React Router DOM 7
- Axios
- styled-components
- Swiper
- ESLint
- Google Material Symbols e Google Fonts
- Node.js e npm

## Arquitetura

A aplicação é uma SPA (Single-Page Application) inicializada por `src/main.tsx`. O componente
`App` configura o tema global, os estilos globais e o `UserProvider`. `AppRoutes` define as
rotas públicas e privadas; `PrivateRoutes` consulta o usuário autenticado e valida os perfis
autorizados antes de renderizar uma página.

O fluxo principal é:

```text
Usuário
  -> Login
  -> POST /api/auth/login
  -> cookie HttpOnly (gerenciado pelo navegador)
  -> UserProvider
  -> GET /api/user/me
  -> PrivateRoutes (autenticação + perfil)
  -> Páginas e componentes
  -> Services (Axios)
  -> API REST
```

As integrações ficam separadas em `src/services`: `auth.service.ts` para autenticação,
`post.service.ts` para aulas/posts e `user.service.ts` para usuários. Tipos compartilhados
ficam em `src/types`, enquanto componentes reutilizáveis ficam em `src/components`.

### Rotas

| Rota | Acesso | Finalidade |
| --- | --- | --- |
| `/login` | Público | Autenticação |
| `/` e `/home` | ADMIN, PROFESSOR, ALUNO | Página inicial |
| `/post/:id` | ADMIN, PROFESSOR, ALUNO | Visualização de uma aula |
| `/post/new` | ADMIN, PROFESSOR | Nova aula |
| `/post/edit/:id` | ADMIN, PROFESSOR | Edição de aula |
| `/user/new` | ADMIN, PROFESSOR | Cadastro de usuário |
| `/user/edit/:id` | ADMIN, PROFESSOR | Edição de usuário |
| `/user/list` | ADMIN, PROFESSOR | Lista de usuários |

## Como rodar

### Pré-requisitos

- Node.js 20 ou superior recomendado.
- npm.
- API do back-end disponível e acessível pela URL configurada em `VITE_BASE_URL`.

### Instalação

```bash
npm install
cp .env.example .env
```

Edite o arquivo `.env` e informe a URL da API. Depois, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrão, o Vite informa no terminal a URL local, normalmente `http://localhost:5173`.

### Outros comandos

```bash
npm run build    # verifica os tipos e gera a build de produção
npm run lint     # executa o ESLint
npm run preview  # serve localmente a build gerada
```

## Variáveis de ambiente

O front-end usa `VITE_BASE_URL` para montar as chamadas à API e as URLs das imagens. Como
variáveis `VITE_*` ficam disponíveis no bundle do navegador, não coloque segredos ou chaves
privadas nesse arquivo.

Arquivo de referência: `.env.example`

```env
VITE_BASE_URL=http://localhost:3000
```

As chamadas são montadas com o sufixo `/api`; por exemplo, o login usa
`${VITE_BASE_URL}/api/auth/login`.

## Decisões técnicas

- React com TypeScript organiza a interface por componentes e reduz erros em dados de usuários,
  posts e perfis.
- Vite oferece um ciclo de desenvolvimento simples e uma build adequada para uma SPA.
- `styled-components` concentra estilos junto dos componentes e permite compartilhar o tema
  visual por `ThemeProvider`.
- A sessão é mantida por cookie `HttpOnly`, `Secure` e `SameSite` emitido pelo back-end. O
  front-end não lê nem persiste tokens no JavaScript, reduzindo o risco de roubo por XSS.
- A autorização é aplicada no front-end para melhorar a experiência de navegação, mas o
  back-end também deve validar autenticação e permissões em todos os endpoints.
- A busca usa debounce de 300 ms para evitar uma requisição a cada tecla, equilibrando
  responsividade e volume de chamadas.
- A API é acessada por serviços separados, mantendo páginas e componentes menos acoplados à
  camada HTTP.
- Não há suíte de testes automatizados ou gerenciamento de estado global além do contexto de
  autenticação identificado no estado atual do projeto.

## Melhorias futuras

- Substituir a navegação imperativa usada no bloqueio de rotas por um fluxo mais previsível e acessível.
- Centralizar a configuração do cliente Axios e seus interceptors de autenticação/expiração de token.
- Adicionar estados de carregamento, vazio e erro mais consistentes para todas as consultas.
- Documentar o contrato da API e disponibilizar ambientes de desenvolvimento e produção.
