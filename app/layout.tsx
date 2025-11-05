import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { getCurrentUserRSC } from '@/lib/api/serverClient';
import { Navbar } from '@/components/layout/Navbar';


import { ToastProvider } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserRSC();

  return (
    <html lang="ru">
      <body className={inter.className}>
        <QueryProvider>
          
          <ToastProvider>
            <AuthProvider initialUser={user}>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="container mx-auto flex-1 p-4">
                  {children}
                </main>
              </div>
              
              <Toaster />
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}