import axios from 'axios';

// Para adjuntar el token JWT en cada request, lo descomentamos cuando esté la imple en el backend
/*
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
             || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/

export default axios;
