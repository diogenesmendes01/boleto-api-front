# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@9

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage - Nginx para servir arquivos estáticos
FROM nginx:1.25-alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar arquivos buildados
COPY --from=builder /app/dist/public /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Criar configuração genérica do servidor (Coolify gerencia o domínio)
RUN echo 'server {\
    listen 80;\
    server_name _;\
    root /usr/share/nginx/html;\
    index index.html;\
    \
    # Configuração SPA - redirecionar todas as rotas para index.html\
    location / {\
        try_files $uri $uri/ /index.html;\
    }\
    \
    # Configuração de segurança\
    add_header X-Frame-Options "SAMEORIGIN" always;\
    add_header X-XSS-Protection "1; mode=block" always;\
    add_header X-Content-Type-Options "nosniff" always;\
    add_header Referrer-Policy "no-referrer-when-downgrade" always;\
    add_header Content-Security-Policy "default-src '\''self'\'' http: https: data: blob: '\''unsafe-inline'\''" always;\
    \
    # Configuração de cache\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
    }\
    \
    # API proxy (opcional)\
    location /api/ {\
        proxy_pass https://api.boletoapi.com/api/;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
    }\
    \
    # Logs\
    access_log /var/log/nginx/access.log;\
    error_log /var/log/nginx/error.log;\
}' > /etc/nginx/conf.d/default.conf

# Expor porta 80 (Coolify gerencia a exposição externa)
EXPOSE 80

# Health check aprimorado
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f -H "Host: localhost" http://127.0.0.1/ || exit 1

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Ajustar permissões
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Mudar para usuário não-root
USER nextjs

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
