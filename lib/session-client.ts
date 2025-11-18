
import { getMeApi } from './api';

export async function getSession() {
  try {
    const r = await getMeApi();
 
    if (!r) return null;
    return r?.user ? r.user : r;
  } catch (e: any) {
    if (e?.status === 401) return null;
    return null;
  }
}

export async function logout() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000'}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch { /* ignore */ }
}
