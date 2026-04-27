const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API = `${API_BASE_URL}/api`;

export const API_CONFIG = {
  baseUrl: API_BASE_URL,

  auth: {
    login: `${API}/auth/login`,
    register: `${API}/auth/register`,
    logout: `${API}/auth/logout`,
    adminLogin: `${API}/auth/admin/login`,
  },

  users: {
    base: `${API}/users`,
    byId: (id: string) => `${API}/users/${id}`,
    collection: (id: string) => `${API}/users/${id}/collection`,
    collectionCard: (id: string, cardId: string) => `${API}/users/${id}/collection/${cardId}`,
    missingCards: (id: string) => `${API}/users/${id}/missing-cards`,
  },

  cards: {
    base: `${API}/cards`,
    catalog: `${API}/cards/catalog`,
    byId: (id: string) => `${API}/cards/catalog/${id}`,
    search: `${API}/cards/search`,
  },

  auctions: {
    base: `${API}/auctions`,
  },

  proposals: {
    base: `${API}/proposals`,
  },

  exchanges: {
    base: `${API}/exchanges`,
  },

  publications: {
    base: `${API}/publications`,
  },
};
