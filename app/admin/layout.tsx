import { getCurrentUserRSC } from '@/lib/api/serverClient';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';


export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUserRSC();

 
  if (!user) {
    
    redirect('/api/auth/login'); 
  }

  if (user.role !== 'admin') {
    
    console.warn(`User ${user.email} tried to access /admin`);
    redirect('/'); 
  }
  
  return (
    <div className="rounded-lg border border-red-500 bg-red-50 p-4">
      <h1 className="text-2xl font-bold text-red-700">Панель Администратора</h1>
      <div className="mt-4">{children}</div>
    </div>
  );
}