'use client';

import { useState } from 'react';
import type { User } from '@/lib/api/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';


type UserUpdatePayload = {
  role?: 'user' | 'admin';
  blocked?: boolean;
};


async function updateUser({ id, payload }: { id: string, payload: UserUpdatePayload }) {
  const { data } = await apiClient.put<User>(`/admin/users/${id}`, payload);
  return data;
}

async function deleteUser(id: string) {
  return apiClient.delete(`/admin/users/${id}`);
}


export function UserManagementTable({ initialUsers }: { initialUsers: User[] }) {

  const [users, setUsers] = useState(initialUsers);
  const queryClient = useQueryClient();
  
 
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      
    },
    onError: (err) => alert(`Ошибка обновления: ${err.message}`),
  });

 
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, userId) => {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    },
    onError: (err) => alert(`Ошибка удаления: ${err.message}`),
  });

 
  const handleToggleBlock = (user: User) => {
    updateMutation.mutate({ 
      id: user.id, 
      payload: { blocked: !user.blocked }
    });
  };

  const handleToggleAdmin = (user: User) => {
    updateMutation.mutate({
      id: user.id,
      payload: { role: user.role === 'admin' ? 'user' : 'admin' }
    });
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Пользователь</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Роль</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Статус</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                {user.blocked ? (
                  <span className="text-sm font-medium text-red-600">Заблокирован</span>
                ) : (
                  <span className="text-sm text-gray-500">Активен</span>
                )}
              </td>
              <td className="flex space-x-2 px-6 py-4">
                <Button variant="outline" size="sm" onClick={() => handleToggleBlock(user)}>
                  {user.blocked ? 'Разблок.' : 'Заблок.'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleAdmin(user)}>
                  {user.role === 'admin' ? 'Разжал.' : 'Назнач. Адм.'}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}