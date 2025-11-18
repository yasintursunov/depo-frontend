
'use client';
import React, { useState } from 'react';

export default function ItemEditor({ item, onSave } : { item?:any, onSave: (payload:any)=>Promise<void> }) {
  const [values, setValues] = useState<any>(item?.values ?? {});
  const [saving, setSaving] = useState(false);

  function setField(key:string, val:any) {
    setValues((v:any)=> ({ ...v, [key]: val }));
  }

  async function save() {
    setSaving(true);
    try {
      await onSave({ ...item, values });
    } catch(e:any) {
      alert(e?.message || 'save failed');
    } finally { setSaving(false); }
  }

  return (
    <div className="p-3 bg-white rounded space-y-2">
      <div className="text-xs text-gray-500">Editing item {item?.custom_id ?? item?.id}</div>
      {/* For simplicity render json editor */}
      <textarea className="w-full border p-2" rows={6} value={JSON.stringify(values, null, 2)} onChange={e=>{ try { setValues(JSON.parse(e.target.value)); } catch{} }} />
      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="px-3 py-1 bg-teal-600 text-white rounded">Save</button>
      </div>
    </div>
  );
}
