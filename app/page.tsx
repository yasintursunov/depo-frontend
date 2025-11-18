
import React from 'react';
import Link from 'next/link';
import { getMeApi } from '../lib/api';

export default async function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CustomID Inventory</h1>
      

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/inventories" className="card text-center py-8">
          <div className="text-xl font-semibold">Inventories</div>
          <div className="text-sm text-gray-500 mt-2">Create and manage inventories</div>
        </Link>

        <Link href="/search" className="card text-center py-8">
          <div className="text-xl font-semibold">Search</div>
          <div className="text-sm text-gray-500 mt-2">Search inventories & items</div>
        </Link>

        <Link href="/admin" className="card text-center py-8">
          <div className="text-xl font-semibold">Admin</div>
          <div className="text-sm text-gray-500 mt-2">User & role management</div>
        </Link>
      </div>
    </div>
  );
}
