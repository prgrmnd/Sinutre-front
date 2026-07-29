# Sinutre - MVP

<img src="https://imgur.com/pS3QvhZ.png" width="100%" alt="Banner do Projeto Sinutre" />

> Projeto final desenvolvido para a Formação em Desenvolvimento Web Moderno. O objetivo principal foi aplicar melhorias no MVP do Sinutre, implementando novas funcionalidades no frontend e backend fornecidos.

## Links de Produção
*   **Frontend (Vercel):** https://sinutre-front.vercel.app
*   **Backend (Railway):** https://sinutre-back-production.up.railway.app

## Repositórios
*   **Repositório Frontend:** https://github.com/prgrmnd/Sinutre-front
*   **Repositório Backend:** https://github.com/prgrmnd/Sinutre-back

---

## Demonstração da Aplicação

| Login Modernizado | Dashboard / Métricas | Página de Alimentos |
| :---: | :---: | :---: |
| ![Login](https://imgur.com/zRs1hqH.png) | ![Dashboard](https://imgur.com/EYzcwvK.png) | ![Alimentos](https://imgur.com/ifLHsG9.png) |
| **Progresso** | **Configurações** | **Inserção de Alimentação** |
| ![Progresso](https://imgur.com/yMfMthn.png) | ![Configurações](https://imgur.com/BSE5UBT.png) | ![Inserção de Refeição](https://imgur.com/c0VHPLV.png) |
## Requisitos Desenvolvidos

Abaixo estão listadas todas as funcionalidades implementadas neste repositório.

### Requisitos Obrigatórios
- [x] Repositório do frontend público no GitHub com as funcionalidades detalhadas no README.
- [x] Repositório do backend público no GitHub.
- [x] Link da aplicação frontend em produção no Vercel.
- [x] Link da API backend em produção no Railway.

### Requisitos Complementares Implementados

- [x] **Ref 01:** Alterar um alimento cadastrado na página de alimentos.
- [x] **Ref 02:** Excluir um alimento cadastrado na página de alimentos.
- [x] **Ref 03:** Incluir validação de dados (tratamento de erros, campos obrigatórios, tipos de informação) no cadastro e/ou alteração de alimentos.
- [x] **Ref 04:** Cadastrar dados complementares do usuário logado (meta calórica, altura e peso) com validação de dados.
- [x] **Ref 05:** Alterar dados complementares do usuário logado.
- [x] **Ref 06:** Visualizar meta calórica no dashboard, buscando do banco de dados.
- [x] **Ref 07:** Sinalizar na interface se a quantidade da meta calórica diária foi ultrapassada.
- [x] **Ref 08:** Criar uma nova página de métricas, acessada pelo menu, contendo dados de IMC e Média Calórica.
- [x] **Ref 09:** Adicionar o IMC do usuário na página de métricas e sinalizar a faixa em que ele se encontra.
- [x] **Ref 10:** Adicionar a Média Calórica dos últimos 7 dias na página de métricas e sua relação com a meta.
- [x] **Ref 11:** Implementar fluxo de logout para o usuário.
- [x] **Ref 12:** Mudar cores da interface original.

### Funcionalidades Extras (Bônus)
- [x] **Melhora na organização da página de adição de alimentos**: Mudança no estilo e organização dos cards, adição visual das informações cadastradas em cada alimento, retirada emojis e troca por ícones e alteração do layout do card de adicionar alimento.
- [x] **Editar e excluir dados das refeições**: Criação de botão para editar dados das refeições na dashboard, criação de modal para editar dados das refeições na dashboard e criação de botão para excluir dados das refeições na dashboard.
- [x] **Evitar envio vazio de formulário**: Adição de alertas visuais de envio e erro do formulário e não permitir envio vazio do formulário de refeições.
- [x] **Correção de bugs**: Correção do arredondamento da gordura, correção do envio vazio do cadastro de refeições e correção do não aparecimento das informações ao atualizar dado do usuário.
- [x] **Disparo de mensagens**: Realizar disparos visuais na tela ao cadastrar, editar ou excluir alimentos e refeições, ao fazer login ou logout, e na ocorrência de erros.
- [x] **Login - Design**: Atualizar design da página de login deixando-o moderno.

---

## Tecnologias Utilizadas

### Frontend
- **React 19** com **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS 4** & **DaisyUI 5** (Estilização e Componentes UI)
- **React Router Dom 7** (Navegação)
- **Axios** (Consumo de API)
- **Phosphor Icons** (Ícones)

### Backend
- **Node.js** com **TypeScript**
- **Express** (Framework Web)
- **Prisma ORM** (Modelagem e Acesso ao Banco de Dados)
- **SQLite** (Banco de Dados Local)
- **LibSQL** (Adapter para Prisma)
- **JSON Web Token (JWT)** (Autenticação)
- **Cors** (Segurança)

---

## Estrutura de Pastas

### Frontend (`Sinutre-front`)
```text
Sinutre-front/
├── public/              # Ativos estáticos públicos
├── src/                 # Código fonte da aplicação
│   ├── components/      # Componentes React reutilizáveis
│   ├── constants/       # Constantes e configurações globais
│   ├── context/         # Contextos para alertas (Toasts)
│   ├── contexts/        # Outros contextos da aplicação
│   ├── data/            # Dados estáticos ou mocks
│   ├── hooks/           # Hooks personalizados
│   ├── layouts/         # Templates de layout de página
│   ├── lib/             # Configurações de bibliotecas externas
│   ├── pages/           # Componentes de página (Login, Dashboard, etc.)
│   ├── routes/          # Definição das rotas da aplicação
│   ├── services/        # Integração com a API (Axios)
│   ├── styles/          # Arquivos de estilização CSS/Tailwind
│   ├── types/           # Definições de tipos TypeScript
│   ├── utils/           # Funções utilitárias auxiliares
│   ├── App.tsx          # Componente raiz
│   └── main.tsx         # Ponto de entrada do React
├── vercel.json          # Configuração de deploy na Vercel
├── vite.config.ts       # Configuração do Vite
└── package.json         # Dependências e scripts
```

### Backend (`Sinutre-back`)
```text
Sinutre-back/
├── prisma/              # Configuração do banco de dados (Schema e Migrations)
│   ├── schema.prisma    # Definição do modelo de dados
│   └── dev.db           # Banco de dados SQLite local
├── src/                 # Código fonte do servidor
│   ├── config/          # Configurações de ambiente e autenticação
│   ├── constants/       # Valores constantes do sistema
│   ├── controllers/     # Lógica de controle das requisições
│   ├── dto/             # Objetos de Transferência de Dados (Data Transfer Objects)
│   ├── middlewares/     # Middlewares de segurança e validação
│   ├── routes/          # Definição dos endpoints da API
│   ├── app.ts           # Configuração do app Express
│   ├── index.ts         # Ponto de entrada do servidor
│   └── prisma.ts        # Instância do cliente Prisma
├── .env.example         # Exemplo de variáveis de ambiente
└── package.json         # Dependências e scripts
```

---

## Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js instalado (versão LTS recomendada)
- Gerenciador de pacotes (npm ou pnpm)

### 1. Configuração do Backend
1. Navegue até a pasta do repositório backend: `Sinutre-back`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`.
   - Preencha as credenciais do **GitHub OAuth** e o **JWT_SECRET**.
4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 2. Configuração do Frontend
1. Navegue até a pasta do repositório frontend: `Sinutre-front`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure a variável de ambiente:
   - Crie um arquivo `.env` (ou use o `.env.example`).
   - Defina `VITE_API_URL=http://localhost:3333` (ou a porta configurada no backend).
4. Inicie a aplicação:
   ```bash
   npm run dev
   ```

---

## Autor
- **Willamy Josué Santos Serejo** (prgrmnd)
