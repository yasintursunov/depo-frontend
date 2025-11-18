
'use client';
import React, { useState, useEffect } from 'react';
import { listTagsApi, createTagApi, addTagToInventoryApi, removeTagFromInventoryApi } from '../lib/api';

export default function TagsManager({ inventoryId, current=[] }: { inventoryId:string, current:any[] }) {
  const [tags, setTags] = useState<any[]>([]);
  const [value, setValue] = useState('');
  const [attached, setAttached] = useState<any[]>(current || []);

  useEffect(()=>{ load(); }, []);

  async function load() {
    try { const all:any = await listTagsApi(); setTags(Array.isArray(all)? all : (all?.data ?? [])); } catch(e){ console.error(e); }
  }

  async function create() {
    if (!value.trim()) return;
    try {
      const t = await createTagApi({ value });
      setTags(prev => [t, ...prev]);
      setValue('');
    } catch(e:any){ alert(e?.body?.error || e?.message); }
  }

  async function attach(tag:any) {
    try {
      await addTagToInventoryApi(inventoryId, tag.id);
      setAttached(prev => [tag, ...prev]);
    } catch(e:any){ alert(e?.body?.error || e?.message); }
  }

  async function detach(tag:any) {
    try {
      await removeTagFromInventoryApi(inventoryId, tag.id);
      setAttached(prev => prev.filter(t=>t.id !== tag.id));
    } catch(e:any){ alert(e?.body?.error || e?.message); }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={value} onChange={e=>setValue(e.target.value)} className="border px-2 py-1 flex-1" placeholder="New tag" />
        <button onClick={create} className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tags.map(t => <button key={t.id} onClick={()=>attach(t)} className="px-2 py-1 rounded border text-sm">{t.value}</button>)}
      </div>

      <div className="mt-2">
        <div className="text-sm font-semibold">Attached</div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {attached.map(t => <div key={t.id} className="px-2 py-1 bg-white rounded flex items-center gap-2"><div>{t.value}</div><button onClick={()=>detach(t)} className="text-sm text-red-500">x</button></div>)}
        </div>
      </div>
    </div>
  );
}
