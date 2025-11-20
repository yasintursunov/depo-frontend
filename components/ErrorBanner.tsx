'use client';
import React from 'react';
import type { ApiError } from '../lib/types';

export default function ErrorBanner({ error }: { error?: unknown }) {
  if (!error) return null;
  const e = error as ApiError;
  const status = e?.status ?? null;
  const message = e?.message ?? (e?.body?.error ?? 'Request failed');
  const details = e?.body?.details ?? null;

  return (
    <div className="p-3 bg-red-50 border rounded text-sm text-red-800">
      <div className="font-semibold">Error{status ? ` (${status})` : ''}: {message}</div>
      {details && <pre className="mt-2 text-xs whitespace-pre-wrap">{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>}
    </div>
  );
}
