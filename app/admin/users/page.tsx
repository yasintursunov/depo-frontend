import { serverApiClient } from '@/lib/api/serverClient';
import type { User } from '@/lib/api/types';
import { UserManagementTable } from './components/UserManagementTable';


async function fetchUsers() {
 
  const users = await serverApiClient.get<User[]>('/admin/users');
  return users || [];
}

export default async function AdminUsersPage() {
  const users = await fetchUsers();

  return (
    <div>
      <h2 className="text-xl font-semibold">Управление пользователями</h2>
      <UserManagementTable initialUsers={users} />
    </div>
  );
}