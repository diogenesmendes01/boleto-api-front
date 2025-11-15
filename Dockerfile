# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production=false --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

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

# Ajustar permissões para nginx (rodando como root por compatibilidade)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
