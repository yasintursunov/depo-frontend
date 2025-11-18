
'use client';
import Link from 'next/link';
import React from 'react';

export default function InventoryCard({ inv }: { inv: any }) {
  const title = inv.title ?? inv.name ?? 'Untitled';
  const desc = inv.description ?? '';
  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
      <div>
        <Link href={`/inventories/${inv.id}`} className="text-indigo-600">Open</Link>
      </div>
    </div>
  );
}
