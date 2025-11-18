
'use client';
import React, { useEffect, useState } from 'react';
import { listAccessApi, addAccessApi, removeAccessApi } from '../lib/api';

export default function AccessManager({ inventoryId }: { inventoryId: string }) {
  const [access, setAccess] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [canWrite, setCanWrite] = useState(true);

  useEffect(()=>{ load(); }, []);

  async function load() {
    try { const r = await listAccessApi(inventoryId); setAccess(r || []); } catch(e){ console.error(e); }
  }

  async function add() {
    if (!userId) return alert('user id required');
    try {
      const r = await addAccessApi(inventoryId, userId, canWrite);
      setAccess(prev => [r, ...prev]);
      setUserId('');
    } catch(e:any){ alert(e?.body?.error || e?.message); }
  }

  async function remove(user_id:string) {
    try {
      await removeAccessApi(inventoryId, user_id);
      setAccess(prev => prev.filter(a => a.user_id !== user_id));
    } catch(e:any){ alert(e?.body?.error || e?.message); }
  }

  return (
    <div className="space-y-2 p-2 bg-white rounded">
      <div className="flex gap-2">
        <input value={userId} onChange={e=>setUserId(e.target.value)} placeholder="User ID" className="border px-2 py-1 flex-1" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={canWrite} onChange={e=>setCanWrite(e.target.checked)} /> can write</label>
        <button onClick={add} className="px-3 py-1 bg-teal-600 text-white rounded">Add</button>
      </div>

      <ul className="mt-2 space-y-2">
        {access.map(a => (
          <li key={a.id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <div className="font-semibold">{a.user?.name ?? a.user_id}</div>
              <div className="text-xs text-gray-500">can_write: {a.can_write ? 'yes' : 'no'}</div>
            </div>
            <div>
              <button onClick={()=>remove(a.user_id)} className="px-2 py-1 rounded border">Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
