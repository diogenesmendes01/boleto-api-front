# BoletoAPI - Documentação da API Externa

## 📍 Base URL
```
https://api.boletoapi.com
```

## 🔍 Endpoints Testados

### 1. **GET /** - Status da API
**Status:** ✅ Funcionando
**Resposta:**
```json
{
  "success": true,
  "message": "API Cobre Fácil Integration",
  "version": "1.0.0",
  "timestamp": "2025-11-14T21:44:01.245Z"
}
```

### 2. **POST /api/auth/resend-verification** - Reenvio de Email de Ativação
**Status:** ✅ Funcionando
**URL completa:** `https://api.boletoapi.com/api/auth/resend-verification`
**Autenticação:** Não requer
**Corpo da requisição:**
```json
{
  "email": "usuario@empresa.com.br"
}
```

**Resposta de sucesso (200):**
```json
{
  "message": "E-mail de ativação reenviado com sucesso! Verifique sua caixa de entrada.",
  "email": "usuario@empresa.com.br"
}
```

**Resposta de erro (400 - EMAIL_ALREADY_VERIFIED):**
```json
{
  "success": false,
  "error": {
    "message": "Este e-mail já foi verificado. Você pode fazer login normalmente.",
    "code": "EMAIL_ALREADY_VERIFIED",
    "statusCode": 400,
    "requestId": "string",
    "timestamp": "string"
  }
}
```

### 2. **POST /api/auth/login** - Login
**Status:** ✅ Funcionando
**Autenticação:** Não requer
**Corpo da requisição:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Resposta de erro (credenciais inválidas):**
```json
{
  "success": false,
  "error": {
    "message": "Credenciais inválidas",
    "statusCode": 401,
    "requestId": "string",
    "timestamp": "string"
  }
}
```

### 3. **POST /api/auth/register** - Registro
**Status:** ✅ Funcionando
**Autenticação:** Não requer
**Campos esperados:** Nomes em português
- `razaoSocial` (não `companyName`)
- Outros campos podem ser diferentes

**Resposta de erro (validação):**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Razão Social é obrigatória",
      "path": "razaoSocial",
      "location": "body"
    }
  ]
}
```

### 4. **GET /api/cf/customers** - Listar Clientes
**Status:** ✅ Funcionando
**Autenticação:** Bearer Token obrigatório
**Cabeçalho:** `Authorization: Bearer {token}`

**Resposta de erro (sem token):**
```json
{
  "error": "Token não fornecido"
}
```

### 5. **GET/POST /api/cf/customers/imports** - Importação de Clientes
**Status:** ✅ Funcionando
**Autenticação:** Bearer Token obrigatório
**Resposta de erro (sem token):**
```json
{
  "error": "Token não fornecido"
}
```

## 🔐 Sistema de Autenticação

- **Tipo:** JWT Bearer Token
- **Cabeçalho:** `Authorization: Bearer {token}`
- **Login:** `POST /api/auth/login`
- **Registro:** `POST /api/auth/register`
- **Reenvio de verificação:** `POST /api/auth/resend-verification`

## ⚠️ Códigos de Erro Implementados

### Registro (POST /api/auth/register)
- **`CNPJ_ALREADY_EXISTS`** - CNPJ já cadastrado no sistema
- **`EMAIL_ALREADY_EXISTS`** - Email já cadastrado no sistema
- **`VALIDATION_ERROR`** - Erro de validação de campos

### Login (POST /api/auth/login)
- **`INVALID_CREDENTIALS`** - E-mail ou senha incorretos
- **`ACCOUNT_DISABLED`** - Conta foi desativada
- **`EMAIL_NOT_VERIFIED`** - E-mail ainda não foi verificado

### Verificação de Email (GET /api/auth/verify-email)
- **`TOKEN_MISSING`** - Token de verificação não fornecido
- **`EMAIL_TOKEN_INVALID`** - Link de verificação inválido
- **`EMAIL_TOKEN_ALREADY_USED`** - Link já foi utilizado
- **`EMAIL_TOKEN_EXPIRED`** - Link expirado

### Renovação de Token (POST /api/auth/refresh)
- **`REFRESH_TOKEN_MISSING`** - Token de renovação não fornecido
- **`REFRESH_TOKEN_INVALID`** - Token inválido ou expirado
- **`USER_NOT_FOUND`** - Usuário não encontrado
- **`ACCOUNT_INACTIVE`** - Conta desativada

### Esqueci Minha Senha (POST /api/auth/forgot-password)
- **`VALIDATION_ERROR`** - Email em formato inválido

### Redefinir Senha (POST /api/auth/reset-password)
- **`PASSWORD_RESET_TOKEN_INVALID`** - Link inválido
- **`PASSWORD_RESET_TOKEN_ALREADY_USED`** - Link já utilizado
- **`PASSWORD_RESET_TOKEN_EXPIRED`** - Link expirado
- **`PASSWORD_TOO_SHORT`** - Senha muito curta

### Alterar Senha (POST /api/auth/change-password)
- **`USER_NOT_FOUND`** - Usuário não encontrado
- **`CURRENT_PASSWORD_INCORRECT`** - Senha atual incorreta
- **`PASSWORD_TOO_SHORT`** - Nova senha muito curta

### Reenvio de Email de Ativação (POST /api/auth/resend-verification)
- **`EMAIL_ALREADY_VERIFIED`** - Email já foi verificado
- **`VALIDATION_ERROR`** - Email em formato inválido

### Autenticação (Middleware)
- **`ACCESS_TOKEN_INVALID`** - Token de acesso inválido ou expirado

### Estrutura de Erro Padrão
```json
{
  "success": false,
  "error": {
    "message": "Mensagem clara e descritiva para o usuário",
    "code": "CODIGO_ESPECIFICO",
    "statusCode": 400,
    "requestId": "abc123",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "data": {
      // Dados adicionais quando relevante
      "email": "usuario@empresa.com.br",
      "companyId": "uuid-aqui"
    }
  }
}
```

## 🌐 Observações

1. **Idioma:** A API parece usar termos em português para campos (ex: `razaoSocial`)
2. **Autenticação:** Todos os endpoints operacionais requerem token Bearer
3. **Estrutura:** Segue padrão RESTful com códigos HTTP apropriados
4. **Erros:** Retorna mensagens de erro em português

## 📝 Status da Integração

✅ **URLs corrigidas** - Base URL atualizada para `/api`
✅ **Registro funcionando** - Cadastro de empresas validado
✅ **Login mapeado** - Endpoint identificado
✅ **Verificação de email** - Endpoint GET implementado
✅ **Reenvio de email** - Funcionalidade completa implementada
✅ **Fluxo de verificação** - Interface completa e responsiva
✅ **Esqueci minha senha** - Fluxo completo implementado
✅ **Redefinir senha** - Interface implementada
✅ **Tratamento de erros** - Todos os códigos de erro tratados no frontend
✅ **Alterar senha** - Endpoint preparado (aguardando implementação)

## 📝 TODO - Próximos Passos

1. **Obter credenciais válidas** para testar endpoints autenticados
2. **Mapear todos os endpoints** (boletos, uploads, configurações)
3. **Implementar endpoints autenticados** no frontend
4. **Testar fluxo completo** de autenticação
5. **Implementar recuperação de senha** (se disponível)

## 🧪 Como Testar

```bash
# Status da API
curl https://api.boletoapi.com/

# Login (credenciais de teste)
curl -X POST https://api.boletoapi.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Endpoint autenticado (requer token)
curl https://api.boletoapi.com/api/cf/customers \
  -H "Authorization: Bearer YOUR_TOKEN"
```
