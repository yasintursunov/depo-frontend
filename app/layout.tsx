
import './globals.css';
import React from 'react';
import Navbar from '../components/Navbar';
import OAuthListener from '@/components/OAuthListener';

export const metadata = {
  title: 'CustomID Inventory',
  description: 'Frontend for CustomID backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <OAuthListener />
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
