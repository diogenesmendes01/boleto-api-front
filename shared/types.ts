/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

// User types
export interface User {
  id: number;
  email: string;
  name: string;
  companyName: string;
}

// API Config types
export interface ApiConfig {
  id: string;
  provider: 'asaas' | 'cobrefacil';
  apiKey: string;
  apiToken?: string;
  webhookToken?: string;
  createdAt: string;
  updatedAt: string;
}

// Boleto types
export interface Boleto {
  id: string;
  nossoNumero: string;
  customerName: string;
  customerEmail?: string;
  customerDocument?: string;
  value: number; // em centavos
  dueDate: string;
  status: 'pending' | 'paid' | 'cancelled' | 'overdue';
  apiProvider: 'asaas' | 'cobrefacil';
  externalId?: string;
  barcode?: string;
  boletoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoletoUpdateInput {
  customerName?: string;
  customerEmail?: string;
  customerDocument?: string;
  value?: number;
  dueDate?: string;
}

// Upload types
export interface Upload {
  id: string;
  fileName: string;
  apiProvider: 'asaas' | 'cobrefacil';
  status: 'success' | 'error' | 'processing';
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadCreateInput {
  file: File;
  apiConfigId: string;
}

export * from "./_core/errors";
