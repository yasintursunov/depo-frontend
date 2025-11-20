import { getMeApi } from './api';
import type { User } from './types';

export async function getSession(): Promise<User | null> {
  try {
    const r = await getMeApi();
    if (!r) return null;
    const maybeUser = (r as any).user ?? r;
    return maybeUser as User;
  } catch (e: unknown) {
    const err = e as { status?: number } | undefined;
    if (err?.status === 401) return null;
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000'}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch { /* ignore */ }
}
