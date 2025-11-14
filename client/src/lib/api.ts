/**
 * Serviço de API REST para integração com backend
 */

// URL base da API externa
const API_BASE_URL = 'https://api.boletoapi.com/api';

// Tipos
export interface ImportResponse {
  import_id: string;
  received_count: number;
}

export interface ImportStatus {
  id: string;
  filename: string;
  total: number;
  staged: number;
  valid: number;
  invalid: number;
  queued: number;
  processed_ok: number;
  processed_fail: number;
  status: 'received' | 'staging' | 'validating' | 'queueing' | 'processing' | 'completed' | 'failed' | 'canceled';
  started_at: string | null;
  finished_at: string | null;
  sample_errors: Array<{
    row_num: number;
    error_code: string;
    error_message: string;
  }>;
}

export interface RetryResponse {
  success: boolean;
  requeued_count: number;
}

// Helper para obter token JWT do localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

// Helper para fazer requisições autenticadas
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro ${response.status}`);
  }

  return response.json();
}

/**
 * Importação em Lote de Clientes
 */

// POST /api/cf/customers/imports - Upload de arquivo para importação
export async function uploadCustomersImport(file: File): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/cf/customers/imports`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao fazer upload' }));
    throw new Error(error.message || `Erro ${response.status}`);
  }

  return response.json();
}

// GET /api/cf/customers/imports/{id}/status - Consultar status da importação
export async function getImportStatus(importId: string): Promise<ImportStatus> {
  return fetchWithAuth(`${API_BASE_URL}/cf/customers/imports/${importId}/status`);
}

// POST /api/cf/customers/imports/{id}/retries - Reprocessar falhas
export async function retryImportFailures(importId: string): Promise<RetryResponse> {
  return fetchWithAuth(`${API_BASE_URL}/cf/customers/imports/${importId}/retries`, {
    method: 'POST',
  });
}

// DELETE /api/cf/customers/imports/{id} - Deletar importação
export async function deleteImport(importId: string): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/cf/customers/imports/${importId}`, {
    method: 'DELETE',
  });
}

/**
 * Autenticação
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    companyName: string;
  };
}

export interface RegisterRequest {
  razaoSocial: string; // Campo correto da API (em português)
  cnpj: string;
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// POST /api/auth/login
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return fetchWithAuth(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// POST /api/auth/register
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  // Mapear campos para a estrutura esperada pela API
  const apiData = {
    razaoSocial: data.razaoSocial,
    cnpj: data.cnpj,
    name: data.name,
    email: data.email,
    password: data.password,
  };

  return fetchWithAuth(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiData),
  });
}

// POST /api/auth/logout
export async function logout(): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  });
}

// GET /api/auth/me
export async function getCurrentUser(): Promise<LoginResponse['user'] | null> {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/auth/me`);
  } catch {
    return null;
  }
}

// POST /api/auth/resend-verification
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth(`${API_BASE_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
}

// GET /api/auth/verify-email
export async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth(`${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);
}

// POST /api/auth/refresh
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  return fetchWithAuth(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
}

// POST /api/auth/forgot-password
export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
}

// POST /api/auth/reset-password
export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  });
}

// POST /api/auth/change-password
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  return fetchWithAuth(`${API_BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/**
 * Funções para Boletos (TODO: implementar quando tiver credenciais)
 */

// GET /api/boletos - Listar boletos
export async function getBoletos(): Promise<any[]> {
  // TODO: Implementar quando tiver token válido
  console.warn('getBoletos não implementado - aguardando credenciais da API externa');
  return [];
}

// GET /api/boletos/{id} - Obter boleto por ID
export async function getBoletoById(id: string): Promise<any> {
  // TODO: Implementar quando tiver token válido
  console.warn(`getBoletoById(${id}) não implementado - aguardando credenciais da API externa`);
  throw new Error('Função não implementada');
}

// PUT /api/boletos/{id} - Atualizar boleto
export async function updateBoleto(id: string, data: any): Promise<any> {
  // TODO: Implementar quando tiver token válido
  console.warn(`updateBoleto(${id}) não implementado - aguardando credenciais da API externa`);
  throw new Error('Função não implementada');
}

// DELETE /api/boletos/{id} - Excluir boleto
export async function deleteBoleto(id: string): Promise<void> {
  // TODO: Implementar quando tiver token válido
  console.warn(`deleteBoleto(${id}) não implementado - aguardando credenciais da API externa`);
  throw new Error('Função não implementada');
}

// POST /api/boletos/{id}/cancel - Cancelar boleto
export async function cancelBoleto(id: string): Promise<any> {
  // TODO: Implementar quando tiver token válido
  console.warn(`cancelBoleto(${id}) não implementado - aguardando credenciais da API externa`);
  throw new Error('Função não implementada');
}

/**
 * Funções para Uploads (TODO: implementar quando tiver credenciais)
 */

// GET /api/uploads - Listar uploads
export async function getUploads(): Promise<any[]> {
  // TODO: Implementar quando tiver token válido
  console.warn('getUploads não implementado - aguardando credenciais da API externa');
  return [];
}

// GET /api/uploads/{id} - Obter upload por ID
export async function getUploadById(id: string): Promise<any> {
  // TODO: Implementar quando tiver token válido
  console.warn(`getUploadById(${id}) não implementado - aguardando credenciais da API externa`);
  throw new Error('Função não implementada');
}

// GET /api/uploads/{uploadId}/boletos - Obter boletos de um upload
export async function getUploadBoletos(uploadId: string): Promise<any[]> {
  // TODO: Implementar quando tiver token válido
  console.warn(`getUploadBoletos(${uploadId}) não implementado - aguardando credenciais da API externa`);
  return [];
}

/**
 * Funções para Configurações de API (TODO: implementar quando tiver credenciais)
 */

// GET /api/configs - Listar configurações
export async function getApiConfigs(): Promise<any[]> {
  // TODO: Implementar quando tiver token válido
  console.warn('getApiConfigs não implementado - aguardando credenciais da API externa');
  return [];
}

// POST /api/configs - Criar/atualizar configuração
export async function upsertApiConfig(data: any): Promise<any> {
  // TODO: Implementar quando tiver token válido
  console.warn("upsertApiConfig não implementado - aguardando credenciais da API externa");
  throw new Error('Função não implementada');
}
