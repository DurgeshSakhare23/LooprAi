import api from './api';

import axios from 'axios';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const register = async (email: string, password: string, username: string) => {
  const response = await api.post('/auth/register', { email, password, username });
  return response.data;
};