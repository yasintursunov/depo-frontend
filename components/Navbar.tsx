
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getMeApi, logoutApi } from '../lib/api';
import { getDevUser } from './DevAuth';

export default function Navbar() {
  const [me, setMe] = useState<any>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  useEffect(() => {
  (async () => {
    try {
      const r = await getMeApi();
      setMe(r?.user ? r.user : r);
    } catch {
      if (process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === 'true') {
        const dev = getDevUser();
        if (dev) setMe(dev);
        else setMe(null);
      } else {
        setMe(null);
      }
    }
  })();
  }, []);

  async function doLogout() {
    try {
      await logoutApi();
    } catch {}
    window.location.href = '/';
  }

  const openGooglePopup = () => {
    const url = `${API_BASE}/api/v1/auth/google`;
    const w = 600;
    const h = 700;
    const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2);
    const opts = `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`;
    const popup = window.open(url, 'google_oauth_popup', opts);

    if (!popup) {
      alert('Popup blocked — opening in the same tab.');
      window.location.href = url;
      return;
    }

    try { popup.focus(); } catch (e) { /* ignore */ }
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">CustomID</Link>
        <div className="flex items-center gap-4">
          <Link href="/inventories" className="text-sm">Inventories</Link>
          <Link href="/search" className="text-sm">Search</Link>

          {me ? (
            <>
              <span className="text-sm">{me.name ?? me.email}</span>
              <button onClick={doLogout} className="text-sm px-3 py-1 rounded border">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={openGooglePopup}
              className="text-sm px-3 py-1 rounded bg-teal-500 text-white"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
