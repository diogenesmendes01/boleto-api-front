/**
 * Serviço de API REST para integração com backend
 */

const API_BASE_URL = '/api';

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
  companyName: string;
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
  return fetchWithAuth(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
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
