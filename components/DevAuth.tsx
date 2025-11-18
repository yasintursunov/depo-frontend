
'use client';
import React, { useEffect, useState } from 'react';

const DEV_KEY = 'dev_mock_user_v1';

export function setDevUser(user: any) {
  try { localStorage.setItem(DEV_KEY, JSON.stringify(user)); } catch {}
}

export function clearDevUser() {
  try { localStorage.removeItem(DEV_KEY); } catch {}
}

export function getDevUser() {
  try { const raw = localStorage.getItem(DEV_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export default function DevAuth() {
  const [u, setU] = useState<any | null>(null);

  useEffect(() => { setU(getDevUser()); }, []);

  function login() {
    const mocked = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Dev User',
      email: 'dev@example.com',
      role: 'admin',
      created_at: new Date().toISOString()
    };
    setDevUser(mocked);
    setU(mocked);
    window.location.reload();
  }

  function logout() {
    clearDevUser();
    setU(null);
    window.location.reload();
  }

  return (
    <div className="text-xs text-gray-500">
      <div className="flex gap-2 items-center">
        {u ? (
          <>
            <div>Dev: {u.name}</div>
            <button onClick={logout} className="px-2 py-1 rounded border text-xs">Clear dev session</button>
          </>
        ) : (
          <button onClick={login} className="px-2 py-1 rounded border text-xs">Simulate dev login</button>
        )}
      </div>
    </div>
  );
}
