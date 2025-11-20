'use client';
import React, { useState } from 'react';
import { searchApi } from '../../lib/api';
import Link from 'next/link';

type SearchResult = {
  inventories?: Array<{ id: string; title?: string }>;
  items?: Array<{ id: string; custom_id?: string; inventory_id?: string }>;
};

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function doSearch() {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const r = await searchApi(q);
      setRes(r as SearchResult);
    } catch (e: unknown) {
      const err = e as any;
      alert(err?.body?.error || err?.message || 'Search failed');
    } finally { setLoading(false); }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Search</h2>
      <div className="mt-2 flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} className="border p-2 rounded flex-1" placeholder="Search inventories and items..." />
        <button onClick={doSearch} className="px-3 py-2 bg-indigo-600 text-white rounded">Search</button>
      </div>

      <div className="mt-4">
        {loading && <div>Searching…</div>}
        {res && (
          <div className="grid gap-4">
            <div>
              <h4 className="font-semibold">Inventories</h4>
              <div className="mt-2 space-y-2">
                {(res.inventories ?? []).map(i => <div key={i.id} className="p-2 bg-white rounded flex justify-between"><div>{i.title}</div><Link href={`/inventories/${i.id}`} className="text-indigo-600">Open</Link></div>)}
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Items</h4>
              <div className="mt-2 space-y-2">
                {(res.items ?? []).map(it => <div key={it.id} className="p-2 bg-white rounded flex justify-between"><div>{it.custom_id ?? it.id}</div><Link href={`/inventories/${it.inventory_id}/items/${it.id}`} className="text-indigo-600">Open</Link></div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
