// lib/api.ts
import type { ApiError, ApiErrorBody } from './types';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';

type ApiInit = Omit<RequestInit, 'body'> & { body?: unknown };

async function parseJSONSafe(res: Response): Promise<unknown | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T = unknown>(path: string, init: ApiInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const { body, ...rest } = init;
  const headers: Record<string, string> = { ...(rest.headers as Record<string, string> || {}) };
  const final: RequestInit = { ...rest, credentials: 'include', headers };

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      final.body = body as unknown as BodyInit;
    } else if (typeof body === 'string') {
      final.body = body;
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    } else {
      final.body = JSON.stringify(body);
      headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    }
    final.headers = headers;
  }

  let res: Response;
  try {
    res = await fetch(url, final);
  } catch {
    const err: ApiError = new Error('Network error') as ApiError;
    err.status = 0;
    err.body = null;
    throw err;
  }

  const data = await parseJSONSafe(res);

  if (res.status === 401) {
    const err: ApiError = new Error('unauthenticated') as ApiError;
    err.status = 401;
    err.body = (data as ApiErrorBody) ?? null;
    throw err;
  }

  if (!res.ok) {
    const err: ApiError = new Error(`API Error: ${res.status}`) as ApiError;
    err.status = res.status;
    err.body = (data as ApiErrorBody) ?? null;
    throw err;
  }

  return data as T;
}

/* Auth */
export const getMeApi = () => apiFetch<Record<string, unknown>>('/api/v1/users/me');
export const getAuthSession = () => apiFetch<Record<string, unknown>>('/api/v1/auth/session');
export const startGoogle = () => { window.location.href = `${API_BASE}/api/v1/auth/google`; };
export const logoutApi = () => apiFetch('/api/v1/auth/logout', { method: 'POST' });

/* Users */
export const updateMeApi = (payload: unknown) => apiFetch<Record<string, unknown>>('/api/v1/users/me', { method: 'PUT', body: payload });
export const getUserByIdApi = (id: string) => apiFetch<Record<string, unknown>>(`/api/v1/users/${encodeURIComponent(id)}`);
export const adminListUsersApi = (limit = 100, offset = 0) => apiFetch<Record<string, unknown>[]>(`/api/v1/admin/users?limit=${limit}&offset=${offset}`);
export const adminSetUserRoleApi = (id: string, payload: unknown) => apiFetch<Record<string, unknown>>(`/api/v1/admin/users/${encodeURIComponent(id)}`, { method: 'PUT', body: payload });

/* Inventories */
export const createInventoryApi = (payload: unknown) => apiFetch<Record<string, unknown>>('/api/v1/inventories', { method: 'POST', body: payload });
export const listInventoriesApi = (limit = 50, offset = 0) => apiFetch<Record<string, unknown>[]>(`/api/v1/inventories?limit=${limit}&offset=${offset}`);
export const getInventoryApi = (id: string) => apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(id)}`);
export const updateInventoryApi = (id: string, payload: unknown) => apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(id)}`, { method: 'PUT', body: payload });
export const deleteInventoryApi = (id: string) => apiFetch('/api/v1/inventories/' + encodeURIComponent(id), { method: 'DELETE' });

/* Fields */
export const upsertFieldApi = (inventoryId: string, payload: unknown) =>
  apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/fields`, { method: 'PUT', body: payload });

export const listFieldsApi = (inventoryId: string) =>
  apiFetch<Record<string, unknown>[]>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/fields`);

export const deleteFieldApi = (inventoryId: string, fieldId: string) =>
  apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/fields?fieldId=${encodeURIComponent(fieldId)}`, { method: 'DELETE' });

/* Items */
export const createItemApi = (inventoryId: string, payload: unknown) =>
  apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/items`, { method: 'POST', body: payload });

export const listItemsApi = (inventoryId: string, limit = 50, offset = 0) =>
  apiFetch<Record<string, unknown>[]>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/items?limit=${limit}&offset=${offset}`);

export const getItemApi = (inventoryId: string, itemId: string) =>
  apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/items/${encodeURIComponent(itemId)}`);

export const updateItemApi = (inventoryId: string, itemId: string, payload: unknown) =>
  apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/items/${encodeURIComponent(itemId)}`, { method: 'PUT', body: payload });

export const deleteItemApi = (inventoryId: string, itemId: string) =>
  apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/items/${encodeURIComponent(itemId)}`, { method: 'DELETE' });

/* Custom elements / tags / search / posts / likes / access */
export const upsertCustomElementsApi = (inventoryId: string, elements: unknown[]) =>
  apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/custom-id-elements`, { method: 'PUT', body: { elements } });
export const listCustomElementsApi = (inventoryId: string) =>
  apiFetch<Record<string, unknown>[]>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/custom-id-elements`);
export const rpcNextCustomApi = (inventoryId: string) => apiFetch<Record<string, unknown>>(`/api/v1/custom-id/next/${encodeURIComponent(inventoryId)}`);

export const listTagsApi = (prefix = '', limit = 10) =>
  apiFetch<Record<string, unknown>[]>(`/api/v1/tags?prefix=${encodeURIComponent(prefix)}&limit=${limit}`);
export const createTagApi = (payload: unknown) => apiFetch<Record<string, unknown>>('/api/v1/tags', { method: 'POST', body: payload });
export const addTagToInventoryApi = (inventoryId: string, tagId: string) => apiFetch(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/tags/${encodeURIComponent(tagId)}`, { method: 'POST' });
export const removeTagFromInventoryApi = (inventoryId: string, tagId: string) => apiFetch(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/tags/${encodeURIComponent(tagId)}`, { method: 'DELETE' });

export const searchApi = (q: string, limit = 20) => apiFetch<Record<string, unknown>>(`/api/v1/search?q=${encodeURIComponent(q)}&limit=${limit}`);

export const listPostsApi = (inventoryId: string) => apiFetch<Record<string, unknown>[]>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/posts`);
export const createPostApi = (inventoryId: string, body: string) => apiFetch<Record<string, unknown>>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/posts`, { method: 'POST', body: { body } });

export const likeApi = (itemId: string) => apiFetch(`/api/v1/likes/${encodeURIComponent(itemId)}/like`, { method: 'POST' });
export const unlikeApi = (itemId: string) => apiFetch(`/api/v1/likes/${encodeURIComponent(itemId)}/unlike`, { method: 'POST' });

export const addAccessApi = (inventoryId: string, userId: string, canWrite = true) =>
  apiFetch(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/access`, { method: 'POST', body: { user_id: userId, can_write: canWrite } });
export const listAccessApi = (inventoryId: string) => apiFetch<Record<string, unknown>[]>(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/access`);
export const removeAccessApi = (inventoryId: string, userId: string) => apiFetch(`/api/v1/inventories/${encodeURIComponent(inventoryId)}/access`, { method: 'DELETE', body: { user_id: userId } });

export function normalizeListResponse<T = unknown>(res: unknown): T[] {
  if (!res) return [];
  if (Array.isArray(res)) return res as T[];
  const asObj = res as Record<string, unknown>;
  if (Array.isArray(asObj?.data as unknown)) return asObj.data as T[];
  if (Array.isArray(asObj?.items as unknown)) return asObj.items as T[];
  return [res as T];
}

const api = {
  apiFetch,
  getMeApi,
  getAuthSession,
  startGoogle,
  logoutApi,
  updateMeApi,
  getUserByIdApi,
  adminListUsersApi,
  adminSetUserRoleApi,
  createInventoryApi,
  listInventoriesApi,
  getInventoryApi,
  updateInventoryApi,
  deleteInventoryApi,
  upsertFieldApi,
  listFieldsApi,
  deleteFieldApi,
  createItemApi,
  listItemsApi,
  getItemApi,
  updateItemApi,
  deleteItemApi,
  upsertCustomElementsApi,
  listCustomElementsApi,
  rpcNextCustomApi,
  listTagsApi,
  createTagApi,
  addTagToInventoryApi,
  removeTagFromInventoryApi,
  searchApi,
  listPostsApi,
  createPostApi,
  likeApi,
  unlikeApi,
  addAccessApi,
  listAccessApi,
  removeAccessApi,
  normalizeListResponse,
};

export default api;
