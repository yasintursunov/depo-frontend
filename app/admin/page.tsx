'use client';
import React, { useEffect, useState } from 'react';
import { adminListUsersApi, adminSetUserRoleApi } from '../../lib/api';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    adminListUsersApi().then(r => {
      setUsers(Array.isArray(r) ? r : (r?.users ?? r ?? []));
    }).catch(e => {
      console.error(e);
      setUsers([]);
    });
  }, []);

  async function toggle(u: any) {
    try {
      const newRole = u.role === 'admin' ? 'user' : 'admin';
      await adminSetUserRoleApi(u.id, { role: newRole });
      const fresh = await adminListUsersApi();
      setUsers(Array.isArray(fresh) ? fresh : (fresh?.users ?? fresh ?? []));
    } catch (e: any) {
      alert(e?.body?.error || e?.message || 'Error');
    }
  }

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
