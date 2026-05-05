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
    missingCard: (id: string, cardId: string) => `${API}/users/${id}/missing-cards/${cardId}`,
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

  publications: {
    base: `${API}/publications`,
    byId: (id: string) => `${API}/publications/${id}`,
  },

  proposals: {
    base: `${API}/proposals`,
    byId: (id: string) => `${API}/proposals/${id}`,
    accept: (id: string) => `${API}/proposals/${id}/accept`,
    reject: (id: string) => `${API}/proposals/${id}/reject`,
    cancel: (id: string) => `${API}/proposals/${id}/cancel`,
  },

  exchanges: {
    base: `${API}/exchanges`,
    byId: (id: string) => `${API}/exchanges/${id}`,
    feedback: (id: string) => `${API}/exchanges/${id}/feedback`,
  },
};
