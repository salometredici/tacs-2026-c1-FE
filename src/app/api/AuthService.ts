import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { LoginResponse } from '../interfaces/auth/LoginResponse';
import { RegisterRequest } from '../interfaces/auth/RegisterRequest';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(API_CONFIG.auth.login, { email, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post(API_CONFIG.auth.logout);
  } catch {
    console.log('Error al hacer logout en backend, pero se limpia el storage igual desde el componente');
  }
};

// Por si quieren crear sus propios usuarios para probar las cosas :)
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(API_CONFIG.auth.register, data);
  return response.data;
};
