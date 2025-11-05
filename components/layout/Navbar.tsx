'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Button } from '@/components/ui/button'; 

export function Navbar() {
  const { isLoggedIn, isAdmin, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          InventoryApp
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link href="/search" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Поиск
          </Link>
          
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin/users" className="text-sm font-medium text-red-500 transition-colors hover:text-red-700">
                  Админка
                </Link>
              )}
              <Link href="/inventories/new" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Создать
              </Link>
              <span className="text-sm font-medium">Привет, {user?.name}!</span>
              <LogoutButton />
            </>
          ) : (
            <Button asChild>
              
             <a href="http://localhost:8000/api/v1/auth/google">
                Войти через Google
              </a>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}