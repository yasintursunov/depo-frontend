'use client';

import { useForm } from 'react-hook-form'; 
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import type { Inventory } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type InventoryFormData = {
  title: string;
  description: string;
  category: string;
  image_url: string;
  is_public: boolean;
};


async function createInventory(payload: InventoryFormData): Promise<Inventory> {
  const { data } = await apiClient.post<Inventory>('/inventories', payload);
  return data;
}

export default function NewInventoryPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<InventoryFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: 'Other',
      image_url: '',
      is_public: false,
    },
  });

  const mutation = useMutation({
    mutationFn: createInventory,
    onSuccess: (createdInventory) => {
    
      router.push(`/inventories/${createdInventory.id}`);
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        alert('Вы не вошли в систему. Пожалуйста, войдите.');
        router.push('/'); 
      } else {
        alert(`Ошибка создания: ${error.message}`);
      }
    },
  });

  const onSubmit = (data: InventoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Создать новый инвентарь</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Название</label>
          <Input 
            id="title" 
            {...register('title', { required: 'Название обязательно' })} 
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Описание</label>
          <Textarea 
            id="description" 
            {...register('description')} 
          />
        </div>
        
       

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox"
            id="is_public" 
            className="h-4 w-4"
            {...register('is_public')} 
          />
          <label htmlFor="is_public" className="text-sm font-medium">
            Сделать публичным
          </label>
        </div>
        
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Создание...' : 'Создать'}
        </Button>
      </form>
    </div>
  );
}