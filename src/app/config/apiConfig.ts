const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Todavía no están todos implementados, pero vamos dejando algunas rutas acá
export const API_CONFIG = {
  baseUrl: API_BASE_URL,

  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    adminLogin: `${API_BASE_URL}/auth/admin/login`,
  },

  users: {
    base: `${API_BASE_URL}/users`,
  },

  catalog: {
    base: `${API_BASE_URL}/catalog`,
  },

  figuritas: {
    base: `${API_BASE_URL}/figuritas`,
    search: `${API_BASE_URL}/figuritas/search`,
  },

  auctions: {
    base: `${API_BASE_URL}/auctions`,
  },

  proposals: {
    base: `${API_BASE_URL}/proposals`,
  },

  exchanges: {
    base: `${API_BASE_URL}/exchanges`,
  },

  publications: {
    base: `${API_BASE_URL}/publications`,
  },
};
