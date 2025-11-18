export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';

type ApiInit = Omit<RequestInit, 'body'> & { body?: any };

async function parseJSONSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch(path: string, init: ApiInit = {}) {
  const url = `${API_BASE}${path}`;
  const { body, ...rest } = init;
  const headers = { ...(rest.headers as Record<string, string> || {}) };
  const final: RequestInit = { ...rest, credentials: 'include', headers };
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      final.body = body;
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
  } catch (networkErr) {
    const err: any = new Error('Network error');
    err.status = 0;
    err.body = null;
    throw err;
  }

  const data = await parseJSONSafe(res);

  if (!res.ok) {
    console.error('API non-ok response', { url, status: res.status, body: data });
  }

  if (res.status === 401) {
    const err: any = new Error('unauthenticated');
    err.status = 401;
    err.body = data;
    throw err;
  }

  if (!res.ok) {
    const err: any = new Error(`API Error: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export async function getMeApi() {
  return apiFetch('/api/v1/users/me');
}

export async function getAuthSession() {
  return apiFetch('/api/v1/auth/session');
}

export const startGoogle = () => {
  window.location.href = `${API_BASE}/api/v1/auth/google`;
};

export async function logoutApi() {
  return apiFetch('/api/v1/auth/logout', { method: 'POST' });
}

export const updateMeApi = async (payload: any) => apiFetch('/api/v1/users/me', { method: 'PUT', body: payload });
export const getUserByIdApi = async (id: string) => apiFetch(`/api/v1/users/${id}`);
export const adminListUsersApi = async (limit = 100, offset = 0) => apiFetch(`/api/v1/admin/users?limit=${limit}&offset=${offset}`);
export const adminSetUserRoleApi = async (id: string, payload: any) => apiFetch(`/api/v1/admin/users/${id}`, { method: 'PUT', body: payload });

export const createInventoryApi = async (payload: any) => apiFetch('/api/v1/inventories', { method: 'POST', body: payload });
export const listInventoriesApi = async (limit = 50, offset = 0) => apiFetch(`/api/v1/inventories?limit=${limit}&offset=${offset}`);
export const getInventoryApi = async (id: string) => apiFetch(`/api/v1/inventories/${id}`);
export const updateInventoryApi = async (id: string, payload: any) => apiFetch(`/api/v1/inventories/${id}`, { method: 'PUT', body: payload });
export const deleteInventoryApi = async (id: string) => apiFetch(`/api/v1/inventories/${id}`, { method: 'DELETE' });

export const upsertFieldApi = async (inventoryId: string, payload: any) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/fields`, { method: 'PUT', body: payload });

export const listFieldsApi = async (inventoryId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/fields`);

export const updateFieldApi = async (inventoryId: string, field: any) =>
  upsertFieldApi(inventoryId, field);

export const deleteFieldApi = async (inventoryId: string, fieldId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/fields?fieldId=${encodeURIComponent(fieldId)}`, { method: 'DELETE' });

export const createItemApi = async (inventoryId: string, payload: any) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/items`, { method: 'POST', body: payload });

export const listItemsApi = async (inventoryId: string, limit = 50, offset = 0) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/items?limit=${limit}&offset=${offset}`);

export const getItemApi = async (inventoryId: string, itemId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/items/${itemId}`);

export const updateItemApi = async (inventoryId: string, itemId: string, payload: any) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/items/${itemId}`, { method: 'PUT', body: payload });

export const deleteItemApi = async (inventoryId: string, itemId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/items/${itemId}`, { method: 'DELETE' });

export const upsertCustomElementsApi = async (inventoryId: string, elements: any[]) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/custom-id-elements`, { method: 'PUT', body: { elements } });

export const listCustomElementsApi = async (inventoryId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/custom-id-elements`);

export const rpcNextCustomApi = async (inventoryId: string) =>
  apiFetch(`/api/v1/custom-id/next/${inventoryId}`);

export const listTagsApi = async (prefix = '', limit = 10) =>
  apiFetch(`/api/v1/tags?prefix=${encodeURIComponent(prefix)}&limit=${limit}`);

export const createTagApi = async (payload: any) =>
  apiFetch('/api/v1/tags', { method: 'POST', body: payload });

export const addTagToInventoryApi = async (inventoryId: string, tagId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/tags/${tagId}`, { method: 'POST' });

export const removeTagFromInventoryApi = async (inventoryId: string, tagId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/tags/${tagId}`, { method: 'DELETE' });

export const searchApi = async (q: string, limit = 20) =>
  apiFetch(`/api/v1/search?q=${encodeURIComponent(q)}&limit=${limit}`);

export const listPostsApi = async (inventoryId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/posts`);

export const createPostApi = async (inventoryId: string, body: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/posts`, { method: 'POST', body: { body } });

export const likeApi = async (itemId: string) =>
  apiFetch(`/api/v1/likes/${itemId}/like`, { method: 'POST' });

export const unlikeApi = async (itemId: string) =>
  apiFetch(`/api/v1/likes/${itemId}/unlike`, { method: 'POST' });

export const addAccessApi = async (inventoryId: string, userId: string, canWrite = true) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/access`, { method: 'POST', body: { user_id: userId, can_write: canWrite } });

export const listAccessApi = async (inventoryId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/access`);

export const removeAccessApi = async (inventoryId: string, userId: string) =>
  apiFetch(`/api/v1/inventories/${inventoryId}/access`, { method: 'DELETE', body: { user_id: userId } });

export function normalizeListResponse<T = any>(res: any): T[] {
  if (!res) return [];
  if (Array.isArray(res)) return res as T[];
  if (res?.data && Array.isArray(res.data)) return res.data as T[];
  if (res?.items && Array.isArray(res.items)) return res.items as T[];
  return [res] as T[];
}

export default {
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
  updateFieldApi,
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
