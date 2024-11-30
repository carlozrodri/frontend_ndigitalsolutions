'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../lib/axios';

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(localStorage.getItem('username') || null);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await apiClient.post('/auth/login/', { username, password });
      localStorage.setItem('token', data.access);
      setUser(username);
      router.push('/tasks');
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    router.push('/auth/login');
  };

  return { user, login, logout };
};
