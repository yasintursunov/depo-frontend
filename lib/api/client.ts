
import axios from 'axios';
import 'client-only'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  

  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
     
      console.error('API 401 - Unauthenticated. Refreshing router...');
      
    }
    return Promise.reject(error);
  }
);