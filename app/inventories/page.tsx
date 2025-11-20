'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { createInventoryApi, listInventoriesApi } from '../../lib/api';
import Link from 'next/link';
import ErrorBanner from '../../components/ErrorBanner';
import type { Inventory } from '../../lib/types';
import InventoryCard from '../../components/InventoryCard';

export default function InventoriesPage() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [page, setPage] = useState(0);
  const limit = 50;

  const load = useCallback(async (pageIndex = 0) => {
    setLoading(true);
    setError(null);
    try {
      const offset = pageIndex * limit;
      const res = await listInventoriesApi(limit, offset);
      const arr = Array.isArray(res) ? res : ((res as any)?.inventories ?? (res ? [res] : []));
      setItems(arr as Inventory[]);
    } catch (e) {
      console.error('listInventories error', e);
      setError(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  async function createInventory() {
    setError(null);
    if (!title.trim()) {
      setError(new Error('Title is required'));
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
    const tempInv: Inventory = { id: tempId, title: payload.title, description: payload.description ?? '', category: payload.category, is_public: payload.is_public, version: 1 };
    setItems(prev => [tempInv, ...prev]);

    try {
      const created = await createInventoryApi(payload);
      const inv = (created as any)?.id ? (created as Inventory) : ((created as any)?.inventory ?? created as Inventory);
      setItems(prev => [inv as Inventory, ...prev.filter(i => i.id !== tempId)]);
      setTitle('');
      setDescription('');
      setCategory('Other');
      setIsPublic(false);
    } catch (e) {
      console.error('createInventory error', e);
      setItems(prev => prev.filter(i => i.id !== tempId));
      setError(e as unknown);
    } finally {
      setCreating(false);
    }
  }

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

        
      </div>

      <div>
        {loading ? (
          <div>Loading inventories…</div>
        ) : (
          <div className="grid gap-3">
            {items.map(i => <InventoryCard key={i.id} inv={i} />)}
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
