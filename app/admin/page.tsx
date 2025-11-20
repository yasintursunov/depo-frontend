'use client';
import React, { useEffect, useState } from 'react';
import { adminListUsersApi, adminSetUserRoleApi } from '../../lib/api';
import type { User } from '../../lib/types';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await adminListUsersApi();
        const arr = Array.isArray(r) ? r : ((r as any)?.users ?? r ?? []);
        if (mounted) setUsers(arr as User[]);
      } catch (e) {
        console.error(e);
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function toggle(u: User) {
    try {
      const newRole = u.role === 'admin' ? 'user' : 'admin';
      await adminSetUserRoleApi(u.id, { role: newRole });
      const fresh = await adminListUsersApi();
      setUsers(Array.isArray(fresh) ? (fresh as User[]) : ((fresh as any)?.users ?? fresh ?? []) as User[]);
    } catch (e: unknown) {
      const err = e as any;
      alert(err?.body?.error || err?.message || 'Error');
    }
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Admin users</h2>
      <ul className="mt-4 space-y-3">
        {users.map(u => (
          <li key={u.id} className="p-3 bg-white rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.name || '—'}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
            <button onClick={() => toggle(u)} className="px-2 py-1 rounded border">
              {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
