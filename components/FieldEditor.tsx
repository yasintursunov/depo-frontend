
'use client';
import React, { useState } from 'react';

export default function FieldEditor({ field, onSave, onDelete } : { field?:any, onSave: (f:any)=>Promise<void>, onDelete?: (id:string)=>Promise<void>}) {
  const [title, setTitle] = useState(field?.title ?? '');
  const [kind, setKind] = useState(field?.kind ?? 'singleline');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim()) return alert('Title required');
    setSaving(true);
    try {
      await onSave({ ...(field || {}), title, kind });
    } catch(e:any) {
      alert(e?.message || 'save failed');
    } finally { setSaving(false); }
  }

  return (
    <div className="p-3 bg-white rounded space-y-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border px-2 py-1 w-full" />
      <select value={kind} onChange={e=>setKind(e.target.value)} className="border px-2 py-1">
        <option value="singleline">Single line</option>
        <option value="multiline">Multiline</option>
        <option value="number">Number</option>
        <option value="doc">Doc</option>
        <option value="bool">Bool</option>
      </select>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
        {field?.id && onDelete && <button onClick={()=>onDelete(field.id)} className="px-3 py-1 rounded border">Delete</button>}
      </div>
    </div>
  );
}
