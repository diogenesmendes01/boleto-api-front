# ConectaAPI - Frontend

Sistema de gerenciamento de boletos com integração para Asaas e Cobre Fácil, incluindo importação em lote de até 100.000 clientes.

## 🚀 Funcionalidades

- ✅ **Autenticação** - Login e cadastro com validação de CNPJ
- ✅ **Dashboard** - Estatísticas e histórico de atividades
- ✅ **Configuração de APIs** - Gerenciar credenciais Asaas e Cobre Fácil
- ✅ **Importação em Lote** - Upload de CSV/NDJSON com até 100k clientes
- ✅ **Acompanhamento em Tempo Real** - Polling automático de status
- ✅ **Gerenciamento de Boletos** - Criar, editar, cancelar e excluir
- ✅ **Detalhes** - Visualização completa de boletos e uploads

## 🛠️ Tecnologias

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + Vite
- **Backend**: Node.js + Express + tRPC
- **Banco de Dados**: MySQL/TiDB (Drizzle ORM)
- **Autenticação**: JWT
- **UI Components**: shadcn/ui + Radix UI

## 📦 Deploy no Coolify

### 1. Pré-requisitos

- Coolify instalado e configurado
- Banco de dados MySQL/MariaDB disponível
- Domínio configurado (opcional)

### 2. Configuração no Coolify

1. **Criar novo serviço**
   - Tipo: Docker Compose ou Git Repository
   - Repositório: `https://github.com/diogenesmendes01/boleto-api-front`
   - Branch: `master`

2. **Configurar variáveis de ambiente**

Adicione as seguintes variáveis no Coolify:

```env
# Database (obrigatório)
DATABASE_URL=mysql://user:password@host:3306/database

# JWT Secret (obrigatório - gere uma chave segura)
JWT_SECRET=sua-chave-super-secreta-aqui

# Server
PORT=3000
NODE_ENV=production
```

3. **Build Settings**
   - Build Command: `pnpm install && pnpm run build`
   - Start Command: `node dist/_core/index.js`
   - Port: `3000`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Acesse via domínio configurado

### 3. Configuração do Banco de Dados

Após o primeiro deploy, execute as migrações:

```bash
pnpm db:push
```

Ou use o script de seed para popular dados de teste:

```bash
node seed-mock-data-with-uploads.mjs
```

## 🔧 Desenvolvimento Local

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Popular dados de teste (opcional)
node seed-mock-data-with-uploads.mjs

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Acessar

- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

## 📝 Estrutura do Projeto

```
conectaapi/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/          # Utilitários e API client
│   │   └── hooks/        # Custom hooks
│   └── public/           # Assets estáticos
├── server/               # Backend Express + tRPC
│   ├── routers.ts       # Definição de rotas tRPC
│   ├── db.ts            # Queries do banco
│   └── _core/           # Infraestrutura
├── drizzle/             # Schema e migrações
│   └── schema.ts        # Definição de tabelas
└── Dockerfile           # Configuração Docker
```

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Validação de CNPJ
- ✅ Proteção de rotas
- ✅ Sanitização de inputs
- ✅ Rate limiting (configurável)

## 📚 Documentação da API

### Importação em Lote

- `POST /api/cf/customers/imports` - Upload de arquivo CSV/NDJSON
- `GET /api/cf/customers/imports/{id}/status` - Consultar status
- `POST /api/cf/customers/imports/{id}/retries` - Reprocessar falhas
- `DELETE /api/cf/customers/imports/{id}` - Deletar importação

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

Verifique se a `DATABASE_URL` está correta e o banco está acessível.

### Build falha no Coolify

1. Verifique os logs de build
2. Certifique-se que todas as variáveis de ambiente estão configuradas
3. Verifique se o Node.js 22 está disponível

### Importação não processa

1. Verifique o formato do CSV
2. Consulte os logs do worker
3. Verifique se a fila está rodando

## 📄 Licença

MIT

## 👥 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
