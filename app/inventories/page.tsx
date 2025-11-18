'use client';

import React, { useEffect, useState } from 'react';
import { createInventoryApi, listInventoriesApi } from '../../lib/api';
import Link from 'next/link';
import ErrorBanner from '../../components/ErrorBanner';

type Inventory = {
  id: string;
  owner_id?: string;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  is_public?: boolean;
  version?: number;
  created_at?: string;
};

export default function InventoriesPage() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(pageIndex = 0) {
    setLoading(true);
    setError(null);
    try {
      const offset = pageIndex * limit;
      const res: any = await listInventoriesApi(limit, offset);
      const arr = Array.isArray(res) ? res : (res?.inventories ?? (res ? [res] : []));
      setItems(arr);
    } catch (e: any) {
      console.error('listInventories error', e);
      if (e?.body?.error) setError(String(e.body.error));
      else if (e?.message) setError(e.message);
      else setError('Failed to load inventories');
    } finally {
      setLoading(false);
    }
  }

  async function createInventory() {
    setError(null);
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      category: category || 'Other',
      image_url: null,
      is_public: Boolean(isPublic)
    };

    setCreating(true);

    const tempId = `temp-${Date.now()}`;
    const tempInv: Inventory = { id: tempId, title: payload.title, description: payload.description || '', category: payload.category, is_public: payload.is_public, version: 1 };
    setItems(prev => [tempInv, ...prev]);

    try {
      const created: any = await createInventoryApi(payload);
      const inv = created?.id ? created : (created?.inventory ?? created);
      setItems(prev => [inv, ...prev.filter(i => i.id !== tempId)]);
      setTitle('');
      setDescription('');
      setCategory('Other');
      setIsPublic(false);
    } catch (e: any) {
      console.error('createInventory error', e);
      setItems(prev => prev.filter(i => i.id !== tempId));
      if (e?.body?.error) setError(String(e.body.error));
      else if (e?.status === 409) setError('Conflict (custom_id or duplicate)');
      else setError(e?.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  }
  {error && <div className="mt-3"><ErrorBanner error={{ status: (error as any).status, message: (error as any).message, body: (error as any).body || (error as any).details }} /></div>}
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Inventories</h1>
        <div className="text-sm text-gray-500">Total shown: {items.length}</div>
      </div>

      <div className="p-4 bg-white rounded shadow-sm mb-4">
        <h2 className="font-semibold mb-2">Create inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            className="border px-3 py-2 rounded col-span-2"
            placeholder="Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded col-span-2"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded md:col-span-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <span className="text-sm">Make public</span>
          </label>
          <div className="flex gap-2 justify-end">
            <button
              onClick={createInventory}
              className="px-4 py-2 rounded bg-teal-600 text-white disabled:opacity-60"
              disabled={creating}
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button
              onClick={() => { setTitle(''); setDescription(''); setCategory('Other'); setIsPublic(false); setError(null); }}
              className="px-3 py-2 rounded border"
            >
              Reset
            </button>
          </div>
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      <div>
        {loading ? (
          <div>Loading inventories…</div>
        ) : (
          <div className="grid gap-3">
            {items.map(i => (
              <div key={i.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-semibold">{i.title}</div>
                  <div className="text-sm text-gray-500">{i.description}</div>
                  <div className="text-xs text-gray-400 mt-1">v{i.version ?? 1}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <Link href={`/inventories/${i.id}`} className="text-indigo-600 text-sm">Open</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">Page {page + 1}</div>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))} className="px-3 py-1 rounded border">Prev</button>
          <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border">Next</button>
        </div>
      </div>
    </div>
  );
}
