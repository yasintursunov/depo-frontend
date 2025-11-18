'use client';
import React from 'react';
import { API_BASE } from '../../lib/api';

export default function LoginPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? API_BASE;
  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-semibold">Sign in</h2>
      <p className="mt-2 text-gray-600">Sign in with Google to access protected routes.</p>

      <div className="mt-6">
        <a
          className="inline-block px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          href={`${base}/api/v1/auth/google`}
        >
          Sign in with Google
        </a>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Note: OAuth uses session-cookie auth. After sign in the app uses the cookie automatically.
      </p>
    </div>
  );
}
