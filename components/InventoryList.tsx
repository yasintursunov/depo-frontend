
'use client';
import React from 'react';
import Link from 'next/link';
import { short } from '../utils/format';

export default function InventoryList({ items = [], loading=false }: { items:any[], loading?: boolean }) {
  if (loading) return <div>Loading inventories…</div>;
  if (!items || items.length === 0) return <div className="text-sm text-gray-500">No inventories yet.</div>;

  return (
    <div className="grid gap-3">
      {items.map(inv => (
        <div key={inv.id} className="card flex items-center justify-between">
          <div>
            <div className="font-semibold">{inv.title ?? 'Untitled'}</div>
            <div className="text-sm text-gray-500">{inv.description}</div>
            <div className="text-xs text-gray-400 mt-1">id: {short(inv.id)} • v{inv.version ?? 1}</div>
          </div>
          <div className="flex gap-2 items-center">
            <Link href={`/inventories/${inv.id}`} className="text-indigo-600 text-sm">Open</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
