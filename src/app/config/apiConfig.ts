const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  
  figuritas: {
    base: `${API_BASE_URL}/figuritas`,
    search: `${API_BASE_URL}/figuritas/search`,
  },
  
  usuarios: {
    base: `${API_BASE_URL}/usuarios`,
  },

  auth: { // para hacer, separar en backend la logica de login, register y logout del controller de cosas del usuario
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
};
