
import { cookies } from 'next/headers';
import 'server-only'; 
import { User } from './types';


const API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1';


async function serverFetch(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  route: string,
  payload?: any,
): Promise<Response> {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get('connect.sid');

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (sessionCookie) {
    headers.append('Cookie', `${sessionCookie.name}=${sessionCookie.value}`);
  }

  const options: RequestInit = {
    method,
    headers,
    cache: 'no-store', 
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API_URL}${route}`, options);
  return response;
}


export const serverApiClient = {
  get: async <T>(route: string): Promise<T | null> => {
    try {
      const res = await serverFetch('GET', route);
      if (!res.ok) {
        
        return null;
      }
      return (await res.json()) as T;
    } catch (error) {
      console.error(`[Server API Client GET Error] ${route}:`, error);
      return null;
    }
  },
  
};


export async function getCurrentUserRSC(): Promise<User | null> {
  const data = await serverApiClient.get<{ user: User }>('/users/me');
  return data ? data.user : null;
}