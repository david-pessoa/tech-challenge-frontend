# Front-end do Projeto Tech Challenge
  Front-end React da aplicação de gerenciamento de posts

## Como Rodar
### Pré-requisitos
  * Node
  * npm

### Instalação
```bash
 npm install
```

### Executando localmente
```bash
npm run dev
```

## Estrutura do diretório `src`

Esta documentação descreve exclusivamente as pastas e os arquivos presentes em `src`.

### Árvore de diretórios

```text
src/
├── App.tsx
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components/
├── context/
│   └── AuthContext.tsx
├── hooks/
├── main.tsx
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Post.tsx
│   ├── PostForm.tsx
│   ├── UserList.tsx
│   └── UserRegister.tsx
├── routes/
│   ├── AppRoutes.tsx
│   └── PrivateRoutes.tsx
├── services/
├── styles/
│   ├── GlobalStyles.ts
│   └── theme.ts
├── types/
└── utils/
```

### Explicação das pastas e arquivos

#### Arquivos da raiz de `src`

- `App.tsx`: componente principal da aplicação. Atualmente renderiza a configuração de rotas.
- `main.tsx`: ponto de entrada do React. Cria a raiz da aplicação, habilita o `StrictMode` e renderiza `App`.

#### `assets/`

Armazena recursos estáticos usados pela interface, como imagens e arquivos SVG.

#### `components/`

Reservada para componentes reutilizáveis da interface, como botões, campos, cabeçalhos, cards e modais. A pasta ainda não possui arquivos.

#### `context/`

Concentra contextos globais do React, usados para compartilhar estado entre diferentes partes da aplicação.

- `AuthContext.tsx`: ponto destinado ao contexto de autenticação, incluindo futuramente usuário logado, sessão, login, logout e permissões.

#### `hooks/`

Reservada para hooks customizados, como hooks de autenticação, busca de dados e controle de formulários. A pasta ainda não possui arquivos.

#### `pages/`

Contém as páginas associadas às rotas da aplicação.

#### `routes/`

Define a navegação e as regras de acesso às páginas.

- `AppRoutes.tsx`: configura o `BrowserRouter`, declara as rotas públicas e privadas e redireciona `/home` para `/`.
- `PrivateRoutes.tsx`: componente de proteção de rotas. Recebe `children` como `ReactNode` e será responsável por permitir ou bloquear o acesso conforme a autenticação.

#### `services/`

Reservada para integrações externas e comunicação com APIs, como autenticação, posts e usuários. A pasta ainda não possui arquivos.

#### `styles/`

Concentra a configuração visual compartilhada da aplicação.

- `GlobalStyles.ts`: ponto destinado aos estilos globais usando styled-components.
- `theme.ts`: ponto destinado aos tokens do tema, como cores, tipografia, espaçamentos e breakpoints.

#### `types/`

Reservada para tipos e interfaces TypeScript compartilhados, como usuário, post, sessão e respostas da API. A pasta ainda não possui arquivos.

#### `utils/`

Reservada para funções utilitárias independentes das páginas e componentes, como formatadores, validadores e helpers. A pasta ainda não possui arquivos.
