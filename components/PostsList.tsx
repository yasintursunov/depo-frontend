
'use client';
import React, { useEffect, useState } from 'react';
import { listPostsApi, createPostApi } from '../lib/api';
import { short } from '@/utils/format';

export default function PostsList({ inventoryId }: { inventoryId: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(()=>{ load(); }, [inventoryId]);

  async function load() {
    try { const r = await listPostsApi(inventoryId); setPosts(r || []); } catch(e){ console.error(e); }
  }

  async function post() {
    if (!text.trim()) return;
    try {
      const p = await createPostApi(inventoryId, text);
      setPosts(prev => [...prev, p]);
      setText('');
    } catch(e:any){ alert(e?.body?.error || e?.message); }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment" className="border px-2 py-1 flex-1" />
        <button onClick={post} className="px-3 py-1 bg-blue-600 text-white rounded">Post</button>
      </div>
      <div className="space-y-2">
        {posts.map(p => (<div key={p.id} className="p-2 bg-white rounded"><div className="text-sm font-semibold">{p.author?.name ?? short(p.author_id)}</div><div className="text-sm">{p.body}</div><div className="text-xs text-gray-400">{new Date(p.created_at).toLocaleString()}</div></div>))}
      </div>
    </div>
  );
}
