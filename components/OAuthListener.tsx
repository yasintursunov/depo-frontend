
'use client';
import { useEffect } from 'react';
import { getMeApi } from '@/lib/api';

export default function OAuthListener() {
  useEffect(() => {
    async function onMessage(e: MessageEvent) {
      if (!e?.data) return;
      if (e.data.type === 'oauth' && e.data.payload) {
        try {
          await getMeApi().catch(()=>{});
        } catch {}
        window.location.href = '/';
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  return null;
}
