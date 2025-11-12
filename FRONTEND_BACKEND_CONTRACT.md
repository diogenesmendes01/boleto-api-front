# Contrato Frontend ↔ Backend - ConectaAPI

Este documento especifica **exatamente** o que o Frontend envia para o Backend e o que recebe de volta em cada operação relacionada a boletos.

---

## Índice

1. [Listar Boletos](#1-listar-boletos)
2. [Buscar Boleto por ID](#2-buscar-boleto-por-id)
3. [Criar Boleto](#3-criar-boleto)
4. [Atualizar Boleto](#4-atualizar-boleto)
5. [Cancelar Boleto](#5-cancelar-boleto)
6. [Excluir Boleto](#6-excluir-boleto)
7. [Buscar Boletos por Upload](#7-buscar-boletos-por-upload)
8. [Tipos de Dados](#tipos-de-dados)

---

## 1. Listar Boletos

**Operação:** Buscar todos os boletos do usuário logado

**Chamada Frontend:**
```typescript
const { data, isLoading, error } = trpc.boleto.list.useQuery();
```

**O que o Frontend ENVIA:**
```typescript
// Nada - query sem parâmetros
```

**O que o Backend RETORNA:**
```typescript
// Array de boletos
[
  {
    id: 1,
    nossoNumero: "2025001",
    apiProvider: "asaas",
    customerName: "João Silva Comércio LTDA",
    customerEmail: "joao.silva@empresa.com",
    customerDocument: "12345678000190",
    value: 15000, // em centavos (R$ 150,00)
    dueDate: "2025-12-31T00:00:00.000Z", // Date
    status: "pending", // "pending" | "paid" | "cancelled" | "overdue"
    externalId: "pay_1234567890",
    barcode: "34191234567890123456789012345678901234567890",
    boletoUrl: "https://www.asaas.com/b/pdf/1234567890",
    uploadId: 5, // ou null se criado manualmente
    createdAt: "2025-11-12T10:30:00.000Z", // Date
    updatedAt: "2025-11-12T10:30:00.000Z", // Date
    userId: 1
  },
  // ... mais boletos
]
```

**Uso no Frontend:**
- Tela de Boletos (listagem completa)
- Dashboard (contadores e últimos boletos)

---

## 2. Buscar Boleto por ID

**Operação:** Buscar detalhes de um boleto específico

**Chamada Frontend:**
```typescript
const { data, isLoading } = trpc.boleto.getById.useQuery({ 
  id: 1 
});
```

**O que o Frontend ENVIA:**
```typescript
{
  id: 1 // number
}
```

**O que o Backend RETORNA:**
```typescript
// Um único boleto (ou null se não encontrado)
{
  id: 1,
  nossoNumero: "2025001",
  apiProvider: "asaas",
  customerName: "João Silva Comércio LTDA",
  customerEmail: "joao.silva@empresa.com",
  customerDocument: "12345678000190",
  value: 15000, // centavos
  dueDate: "2025-12-31T00:00:00.000Z",
  status: "pending",
  externalId: "pay_1234567890",
  barcode: "34191234567890123456789012345678901234567890",
  boletoUrl: "https://www.asaas.com/b/pdf/1234567890",
  uploadId: 5,
  createdAt: "2025-11-12T10:30:00.000Z",
  updatedAt: "2025-11-12T10:30:00.000Z",
  userId: 1
}
```

**Uso no Frontend:**
- Página de detalhes do boleto (`/boleto/:id`)

---

## 3. Criar Boleto

**Operação:** Criar um novo boleto manualmente (sem upload de planilha)

**Chamada Frontend:**
```typescript
const createMutation = trpc.boleto.create.useMutation();

await createMutation.mutateAsync({
  apiProvider: "asaas",
  customerName: "Maria Santos LTDA",
  customerEmail: "maria@empresa.com",
  customerDocument: "98765432000110",
  value: 25000, // R$ 250,00 em centavos
  dueDate: new Date("2025-12-31")
});
```

**O que o Frontend ENVIA:**
```typescript
{
  apiProvider: "asaas" | "cobrefacil", // string
  customerName: string, // obrigatório
  customerEmail?: string, // opcional
  customerDocument?: string, // opcional (CPF/CNPJ)
  value: number, // centavos, obrigatório
  dueDate: Date // obrigatório
}
```

**O que o Backend RETORNA:**
```typescript
// Boleto criado com sucesso
{
  id: 11,
  nossoNumero: "2025011", // gerado automaticamente
  apiProvider: "asaas",
  customerName: "Maria Santos LTDA",
  customerEmail: "maria@empresa.com",
  customerDocument: "98765432000110",
  value: 25000,
  dueDate: "2025-12-31T00:00:00.000Z",
  status: "pending",
  externalId: "pay_9876543210", // retornado pela API externa
  barcode: "34191234567890123456789012345678901234567890",
  boletoUrl: "https://www.asaas.com/b/pdf/9876543210",
  uploadId: null,
  createdAt: "2025-11-12T15:45:00.000Z",
  updatedAt: "2025-11-12T15:45:00.000Z",
  userId: 1
}
```

**Uso no Frontend:**
- Botão "Novo Boleto" na tela de Boletos (futuro)
- Modal de criação manual de boleto

---

## 4. Atualizar Boleto

**Operação:** Editar informações de um boleto existente

**Chamada Frontend:**
```typescript
const updateMutation = trpc.boleto.update.useMutation();

await updateMutation.mutateAsync({
  id: 1,
  customerName: "João Silva Comércio LTDA - Atualizado",
  customerEmail: "joao.novo@empresa.com",
  customerDocument: "12345678000190",
  value: 20000, // R$ 200,00
  dueDate: new Date("2026-01-31")
});
```

**O que o Frontend ENVIA:**
```typescript
{
  id: number, // obrigatório
  customerName?: string, // opcional
  customerEmail?: string, // opcional
  customerDocument?: string, // opcional
  value?: number, // centavos, opcional
  dueDate?: Date // opcional
}
```

**O que o Backend RETORNA:**
```typescript
// Boleto atualizado
{
  id: 1,
  nossoNumero: "2025001",
  apiProvider: "asaas",
  customerName: "João Silva Comércio LTDA - Atualizado",
  customerEmail: "joao.novo@empresa.com",
  customerDocument: "12345678000190",
  value: 20000,
  dueDate: "2026-01-31T00:00:00.000Z",
  status: "pending",
  externalId: "pay_1234567890",
  barcode: "34191234567890123456789012345678901234567890",
  boletoUrl: "https://www.asaas.com/b/pdf/1234567890",
  uploadId: 5,
  createdAt: "2025-11-12T10:30:00.000Z",
  updatedAt: "2025-11-12T16:00:00.000Z", // atualizado
  userId: 1
}
```

**Uso no Frontend:**
- Modal de edição na tela de Boletos
- Página de detalhes do boleto

**Observação:** Backend deve validar se o boleto pode ser editado (status = "pending")

---

## 5. Cancelar Boleto

**Operação:** Cancelar um boleto (muda status para "cancelled")

**Chamada Frontend:**
```typescript
const cancelMutation = trpc.boleto.cancel.useMutation();

await cancelMutation.mutateAsync({
  id: 1
});
```

**O que o Frontend ENVIA:**
```typescript
{
  id: number // obrigatório
}
```

**O que o Backend RETORNA:**
```typescript
// Boleto cancelado
{
  id: 1,
  nossoNumero: "2025001",
  apiProvider: "asaas",
  customerName: "João Silva Comércio LTDA",
  customerEmail: "joao.silva@empresa.com",
  customerDocument: "12345678000190",
  value: 15000,
  dueDate: "2025-12-31T00:00:00.000Z",
  status: "cancelled", // status alterado
  externalId: "pay_1234567890",
  barcode: "34191234567890123456789012345678901234567890",
  boletoUrl: "https://www.asaas.com/b/pdf/1234567890",
  uploadId: 5,
  createdAt: "2025-11-12T10:30:00.000Z",
  updatedAt: "2025-11-12T16:15:00.000Z", // atualizado
  userId: 1
}
```

**Uso no Frontend:**
- Modal de confirmação de cancelamento
- Página de detalhes do boleto

**Observação:** Backend também cancela o boleto na API externa (Asaas/Cobre Fácil)

---

## 6. Excluir Boleto

**Operação:** Excluir permanentemente um boleto do sistema

**Chamada Frontend:**
```typescript
const deleteMutation = trpc.boleto.delete.useMutation();

await deleteMutation.mutateAsync({
  id: 1
});
```

**O que o Frontend ENVIA:**
```typescript
{
  id: number // obrigatório
}
```

**O que o Backend RETORNA:**
```typescript
// Confirmação de exclusão
{
  success: true,
  id: 1
}
```

**Uso no Frontend:**
- Modal de confirmação de exclusão
- Página de detalhes do boleto

**Observação:** Backend cancela o boleto na API externa antes de excluir do banco

---

## 7. Buscar Boletos por Upload

**Operação:** Listar todos os boletos gerados por um upload específico

**Chamada Frontend:**
```typescript
const { data } = trpc.boleto.getByUploadId.useQuery({
  uploadId: 5
});
```

**O que o Frontend ENVIA:**
```typescript
{
  uploadId: number // obrigatório
}
```

**O que o Backend RETORNA:**
```typescript
// Array de boletos vinculados ao upload
[
  {
    id: 1,
    nossoNumero: "2025001",
    apiProvider: "asaas",
    customerName: "Cliente 1",
    customerEmail: "cliente1@email.com",
    customerDocument: "12345678000190",
    value: 15000,
    dueDate: "2025-12-31T00:00:00.000Z",
    status: "pending",
    externalId: "pay_1234567890",
    barcode: "34191234567890123456789012345678901234567890",
    boletoUrl: "https://www.asaas.com/b/pdf/1234567890",
    uploadId: 5,
    createdAt: "2025-11-12T10:30:00.000Z",
    updatedAt: "2025-11-12T10:30:00.000Z",
    userId: 1
  },
  // ... mais boletos do mesmo upload
]
```

**Uso no Frontend:**
- Página de detalhes do upload (`/upload/:id`)
- Tabela de boletos gerados pelo upload

---

## Tipos de Dados

### Boleto (Tipo completo retornado pelo backend)

```typescript
type Boleto = {
  id: number;
  nossoNumero: string;
  apiProvider: "asaas" | "cobrefacil";
  customerName: string;
  customerEmail: string | null;
  customerDocument: string | null;
  value: number; // sempre em centavos
  dueDate: Date;
  status: "pending" | "paid" | "cancelled" | "overdue";
  externalId: string | null; // ID na API externa
  barcode: string | null;
  boletoUrl: string | null;
  uploadId: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
};
```

### Status do Boleto

```typescript
type BoletoStatus = "pending" | "paid" | "cancelled" | "overdue";
```

**Significado:**
- `pending`: Aguardando pagamento
- `paid`: Pago
- `cancelled`: Cancelado pelo usuário
- `overdue`: Vencido (data de vencimento passou e não foi pago)

### API Provider

```typescript
type ApiProvider = "asaas" | "cobrefacil";
```

---

## Conversões Importantes

### 1. Valor (Centavos ↔ Reais)

**Backend sempre trabalha em centavos:**
```typescript
// Frontend → Backend
const valueInCents = Math.round(valueInReais * 100);

// Backend → Frontend (para exibição)
const valueInReais = valueInCents / 100;
```

**Exemplo:**
- R$ 150,00 → 15000 centavos
- 25000 centavos → R$ 250,00

### 2. Data de Vencimento

**Frontend envia Date, Backend armazena e retorna Date:**
```typescript
// Frontend → Backend
const dueDate = new Date("2025-12-31");

// Backend → Frontend (formatação para exibição)
const formatted = new Date(boleto.dueDate).toLocaleDateString('pt-BR');
// "31/12/2025"
```

### 3. Status Badge (Frontend)

```typescript
const getStatusInfo = (status: BoletoStatus) => {
  const statusMap = {
    pending: { 
      label: 'Pendente', 
      className: 'bg-yellow-100 text-yellow-800' 
    },
    paid: { 
      label: 'Pago', 
      className: 'bg-green-100 text-green-800' 
    },
    cancelled: { 
      label: 'Cancelado', 
      className: 'bg-red-100 text-red-800' 
    },
    overdue: { 
      label: 'Vencido', 
      className: 'bg-gray-100 text-gray-800' 
    },
  };
  
  return statusMap[status];
};
```

---

## Resumo de Operações

| Operação | Endpoint tRPC | Envia | Recebe |
|----------|---------------|-------|--------|
| Listar todos | `boleto.list` | - | `Boleto[]` |
| Buscar por ID | `boleto.getById` | `{ id }` | `Boleto \| null` |
| Criar | `boleto.create` | `{ apiProvider, customerName, value, dueDate, ... }` | `Boleto` |
| Atualizar | `boleto.update` | `{ id, customerName?, value?, ... }` | `Boleto` |
| Cancelar | `boleto.cancel` | `{ id }` | `Boleto` |
| Excluir | `boleto.delete` | `{ id }` | `{ success: true, id }` |
| Por Upload | `boleto.getByUploadId` | `{ uploadId }` | `Boleto[]` |

---

## Validações do Frontend

Antes de enviar para o Backend, o Frontend deve validar:

1. **Valor:** Maior que R$ 0,00
2. **Data de Vencimento:** Não pode ser no passado
3. **Nome do Cliente:** Não pode estar vazio
4. **API Provider:** Deve estar ativa (verificar `apiConfigurations`)

---

## Tratamento de Erros

**Backend pode retornar erros tRPC:**

```typescript
try {
  await createMutation.mutateAsync({ ... });
} catch (error) {
  // error.message contém a mensagem de erro
  toast.error(error.message);
}
```

**Exemplos de erros:**
- "Boleto não encontrado"
- "Você não tem permissão para editar este boleto"
- "Não é possível editar um boleto pago ou cancelado"
- "API não configurada ou inativa"
- "Erro ao comunicar com a API externa: [detalhes]"

---

**Documento criado em:** 12/11/2025  
**Versão:** 1.0  
**Foco:** Contrato Frontend ↔ Backend
