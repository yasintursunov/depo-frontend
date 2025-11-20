'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getInventoryApi,
  listItemsApi,
  createItemApi,
  listFieldsApi,
  upsertFieldApi,
  deleteFieldApi,
  listCustomElementsApi,
  upsertCustomElementsApi,
  listTagsApi,
  likeApi
} from '../../../lib/api';
import FieldEditor from '../../../components/FieldEditor';
import ItemEditor from '../../../components/ItemEditor';
import TagsManager from '../../../components/TagsManager';
import AccessManager from '../../../components/AccessManager';
import PostsList from '../../../components/PostsList';
import type { Inventory, Field, Item } from '../../../lib/types';

export default function InventoryDetails({ params }: { params: { id: string } }) {
  const id = params.id;
  const [inv, setInv] = useState<Inventory | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [editingField, setEditingField] = useState<Field | undefined>(undefined);
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const i = await getInventoryApi(id);
      setInv((i as any) ?? null);
      const it = await listItemsApi(id);
      setItems(Array.isArray(it) ? (it as Item[]) : ((it as any)?.items ?? []) as Item[]);
      const f = await listFieldsApi(id);
      setFields(f as Field[] ?? []);
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function addField(field: Partial<Field>) {
    try {
      const saved = await upsertFieldApi(id, field);
      setFields(prev => [saved as Field, ...prev.filter(p => (p.id) !== (saved as any).id)]);
      setEditingField(undefined);
    } catch (e: unknown) {
      const err = e as any;
      alert(err?.body?.error || err?.message);
    }
  }

  async function removeField(fieldId: string) {
    try {
      await deleteFieldApi(id, fieldId);
      setFields(prev => prev.filter(f => f.id !== fieldId));
    } catch (e: unknown) {
      const err = e as any;
      alert(err?.body?.error || err?.message);
    }
  }

  async function createItem() {
    try {
      const res = await createItemApi(id, { values: {} });
      setItems(prev => [(res as Item), ...prev]);
    } catch (e: unknown) {
      const err = e as any;
      alert(err?.body?.error || err?.message);
    }
  }

  async function like(it: Item) {
    try { await likeApi(it.id); } catch { /* ignore */ }
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{inv?.title}</h2>
          <p className="text-sm text-gray-600">{inv?.description}</p>
        </div>
        <div>
          <button onClick={() => router.push('/inventories')} className="px-3 py-2 bg-red-500 text-white rounded">Back</button>
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="p-3 bg-white rounded">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Fields</h3>
              <button onClick={() => setEditingField({} as Field)} className="px-2 py-1 rounded border">New field</button>
            </div>
            <div className="mt-3 space-y-2">
              {fields.map(f => (
                <div key={f.id} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                  <div>{f.title} • {f.kind}</div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingField(f)} className="text-sm border px-2 py-1 rounded">Edit</button>
                    <button onClick={() => removeField(f.id)} className="text-sm border px-2 py-1 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {editingField && <div className="mt-3"><FieldEditor field={editingField} onSave={addField} onDelete={removeField} /></div>}
          </div>

          <div className="p-3 bg-white rounded">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Items</h3>
              <div className="flex gap-2">
                <button onClick={createItem} className="px-2 py-1 bg-teal-600 text-white rounded">Create item</button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {items.map(it => (
                <div key={it.id} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                  <div>
                    <div className="font-mono">{it.custom_id ?? it.id}</div>
                    <div className="text-xs text-gray-500">v{it.version}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => like(it)} className="text-blue-600 text-sm">Like</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white rounded">
            <h3 className="font-semibold">Discussion</h3>
            <div className="mt-3"><PostsList inventoryId={id} /></div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-3 bg-white rounded">
            <h4 className="font-semibold">Tags</h4>
            <div className="mt-2"><TagsManager inventoryId={id} current={[]} /></div>
          </div>

          <div className="p-3 bg-white rounded">
            <h4 className="font-semibold">Access</h4>
            <div className="mt-2"><AccessManager inventoryId={id} /></div>
          </div>
        </aside>
      </section>
    </div>
  );
}
