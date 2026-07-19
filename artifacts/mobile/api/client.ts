// ─── API Client ───────────────────────────────────────────────────────────────
// Base HTTP client for Cravio backend (Supabase REST + Edge Functions).
// Phase 1: interface definitions only.
// Phase 2: integrate with the real Supabase client from services/supabase.ts.

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
}

// ─── Stub implementations ─────────────────────────────────────────────────────
// Replace these with real Supabase calls in Phase 2.

const NOT_IMPLEMENTED: ApiResponse<never> = {
  data: null,
  error: { message: 'Not implemented', code: 'NOT_IMPLEMENTED' },
  status: 501,
};

export async function apiGet<T>(
  _endpoint: string,
  _options?: RequestOptions
): Promise<ApiResponse<T>> {
  return NOT_IMPLEMENTED as ApiResponse<T>;
}

export async function apiPost<T, B = unknown>(
  _endpoint: string,
  _body: B,
  _options?: RequestOptions
): Promise<ApiResponse<T>> {
  return NOT_IMPLEMENTED as ApiResponse<T>;
}

export async function apiPut<T, B = unknown>(
  _endpoint: string,
  _body: B,
  _options?: RequestOptions
): Promise<ApiResponse<T>> {
  return NOT_IMPLEMENTED as ApiResponse<T>;
}

export async function apiPatch<T, B = unknown>(
  _endpoint: string,
  _body: Partial<B>,
  _options?: RequestOptions
): Promise<ApiResponse<T>> {
  return NOT_IMPLEMENTED as ApiResponse<T>;
}

export async function apiDelete<T>(
  _endpoint: string,
  _options?: RequestOptions
): Promise<ApiResponse<T>> {
  return NOT_IMPLEMENTED as ApiResponse<T>;
}
