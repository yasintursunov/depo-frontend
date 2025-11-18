
'use client';
import React from 'react';

export default function ErrorBanner({ error }: { error?: any }) {
  if (!error) return null;

  const status = error?.status ?? (error?.body?.status ?? null);
  const message = error?.message ?? error?.body?.error ?? (typeof error === 'string' ? error : null);
  const details = error?.body?.details ?? error?.body ?? error?.details ?? null;

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
      <div className="font-semibold">Error{status ? ` (${status})` : ''}: {message || 'Request failed'}</div>
      {details && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-700">Show details</summary>
          <pre className="mt-2 whitespace-pre-wrap text-xs">{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
