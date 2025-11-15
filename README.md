# BoletoAPI - Frontend

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
- **Backend**: API externa (https://api.boletoapi.com/)
- **UI Components**: shadcn/ui + Radix UI
- **Estado**: TanStack Query (React Query)
- **HTTP Client**: Axios

## 📦 Deploy

### Opção 1: Coolify (Recomendado para Produção)

#### Pré-requisitos
- Coolify instalado e configurado
- Domínio www.boletoapi.com apontado para o servidor Coolify

#### Deploy no Coolify

1. **Importar projeto**
   - Vá para seu painel Coolify
   - Clique em "New Project" → "Import from Git"
   - Cole a URL do repositório
   - Selecione a branch principal

2. **Configurar serviço**
   - O Coolify detectará automaticamente o `coolify.json`
   - Configure o domínio: `www.boletoapi.com`
   - SSL será configurado automaticamente

3. **Deploy**
   - Clique em "Deploy"
   - Coolify fará o build e deploy automaticamente

#### Recursos configurados
- ✅ **CPU:** 0.25-0.5 core
- ✅ **Memória:** 128-256MB
- ✅ **Health Check:** Automático a cada 30s
- ✅ **SSL:** Let's Encrypt automático
- ✅ **SPA Routing:** Configurado para React Router

### Opção 2: Docker Manual

#### Pré-requisitos
- Docker instalado
- Backend API rodando em https://api.boletoapi.com/

#### Deploy com Docker

1. **Build da imagem**
```bash
docker build -t boletoapi-frontend .
```

2. **Executar o container**
```bash
docker run -d -p 3200:3200 --name boletoapi-frontend boletoapi-frontend
```

3. **Verificar se está rodando**
```bash
curl http://localhost
```

#### Configuração de Domínio

O Dockerfile já está configurado para o domínio `www.boletoapi.com`. Para usar em produção:

```bash
# Com variável de ambiente
docker run -d -p 3200:3200 \
  -e VIRTUAL_HOST=www.boletoapi.com \
  --name boletoapi-frontend \
  boletoapi-frontend
```

### Opção 2: Deploy Manual

#### Pré-requisitos
- Servidor web (Apache, Nginx, Vercel, Netlify, etc.)
- Backend API rodando em https://api.boletoapi.com/

#### Deploy Manual

1. **Build da aplicação**
```bash
npm run build
```

2. **Deploy dos arquivos**
   - Faça upload da pasta `dist/public/` para seu servidor web
   - Configure o servidor para servir `index.html` como fallback para todas as rotas (SPA)

3. **Configuração do servidor web**

**Nginx:**
```nginx
server {
    listen 80;
    server_name www.boletoapi.com boletoapi.com;
    root /path/to/dist/public;
    index index.html;

    # Configuração SPA - redirecionar todas as rotas para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configuração de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Configuração de cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Desenvolvimento Local

### Opção 1: Desenvolvimento com Vite

#### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

#### Acessar

- Frontend: http://localhost:5173
- Backend API: https://api.boletoapi.com/

### Opção 2: Desenvolvimento com Docker

#### Build e execução local

```bash
# Build da imagem
docker build -t boletoapi-frontend-dev .

# Executar em modo desenvolvimento
docker run -d -p 3000:3200 --name boletoapi-dev boletoapi-frontend-dev

# Verificar se está rodando
curl http://localhost:3000
```

#### Com Docker Compose (produção local)

```bash
# Criar rede externa (se não existir)
docker network create web

# Executar com docker-compose
docker-compose up -d

# Verificar se está rodando
curl http://localhost:3200
```

## 📝 Estrutura do Projeto

```
boleto-api-front/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/          # Utilitários e API client
│   │   └── hooks/        # Custom hooks
│   └── public/           # Assets estáticos
├── shared/                # Tipos e constantes compartilhados
├── components.json        # Configuração shadcn/ui
├── package.json           # Dependências do projeto
├── tsconfig.json          # Configuração TypeScript
├── vite.config.ts         # Configuração Vite
└── README.md              # Esta documentação
```

## 🔐 Segurança

- ✅ Autenticação baseada na API externa
- ✅ Validação de CNPJ
- ✅ Proteção de rotas via frontend
- ✅ Sanitização de inputs

## 🐛 Troubleshooting

### Build falha

1. Verifique se o Node.js 22+ está instalado
2. Execute `npm install` para instalar dependências
3. Verifique se não há erros de TypeScript com `npm run check`

### API não responde

1. Verifique se a API externa https://api.boletoapi.com/ está acessível
2. Consulte a documentação da API externa para endpoints disponíveis
3. Verifique se há problemas de CORS ou autenticação

### Erro de dependências

Execute `npm install --legacy-peer-deps` se houver conflitos de versão.

## 📄 Licença

MIT

## 👥 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
