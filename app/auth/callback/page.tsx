'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMeApi } from '@/lib/api';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        await getMeApi();
      } catch {
        // ignore
      } finally {
        router.replace('/');
      }
    })();
  }, [router]);
  return <div className="p-6">Signing in…</div>;
}
