'use client';

import { useState } from 'react';
import type { Inventory } from '@/lib/api/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


type FormInputs = {
  title: string;
  description: string;
};


type UpdatePayload = FormInputs & {
  version: number;
};


async function updateInventory({ id, payload }: { id: string, payload: UpdatePayload }) {
  const { data } = await apiClient.put<Inventory>(`/inventories/${id}`, payload);
  return data;
}

export function InventoryHeader({ initialInventory }: { initialInventory: Inventory }) {

  const [inventory, setInventory] = useState(initialInventory);
  const [isEditing, setIsEditing] = useState(false);
  
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      title: inventory.title,
      description: inventory.description || '',
    },
  });

  const mutation = useMutation({
    mutationFn: updateInventory,
    onSuccess: (updatedInventory) => {
     
      setInventory(updatedInventory); 
      
      setIsEditing(false);
      
      queryClient.invalidateQueries({ queryKey: ['inventory', inventory.id] });
      alert('Сохранено!');
    },
    onError: (error: any) => {
    
      if (error.response && error.response.status === 409) {
        alert(
          'ОШИБКА: Конфликт версий! \n\nКто-то другой изменил этот инвентарь, ' +
          'пока вы его редактировали. \n\nСтраница будет перезагружена, ' +
          'чтобы получить свежие данные.'
        );
        
        window.location.reload(); 
      } else {
        alert(`Ошибка сохранения: ${error.message}`);
      }
    },
  });

  const onSave: SubmitHandler<FormInputs> = (data) => {
    mutation.mutate({
      id: inventory.id,
      payload: {
        ...data,
       
        version: inventory.version, 
      },
    });
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      {isEditing ? (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input {...register('title')} className="text-2xl font-bold" />
          <Input {...register('description')} />
          <div className="flex space-x-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">{inventory.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{inventory.description}</p>
          <p className="mt-1 text-sm text-gray-500">
            Категория: {inventory.category} (Версия: {inventory.version})
          </p>
          <Button onClick={() => setIsEditing(true)} className="mt-4">
            Редактировать
          </Button>
         
          <Button asChild variant="outline" className="ml-2">
            <a href={`/inventories/${inventory.id}/settings`}>
              Настройки
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}