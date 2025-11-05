'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

async function postLogout() {
  return apiClient.post('/auth/logout');
}

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
     
      queryClient.clear();
      
      router.refresh();
    
      router.push('/'); 
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      alert('Не удалось выйти. Попробуйте снова.');
    },
  });

  return (
    <Button
      variant="ghost"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Выходим...' : 'Выход'}
    </Button>
  );
}