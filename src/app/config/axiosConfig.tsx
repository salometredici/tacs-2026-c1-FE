import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import Snackbar from '../components/feedback/Snackbar';

// Bearer token (sessionId opaco) en cada request. Hay un solo token; el role viaja en el UserDto.
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ApiErrorBody {
  message?: string;
}

function extractMessage(error: AxiosError<ApiErrorBody>): string {
  const apiMessage = error.response?.data?.message;
  if (apiMessage) return apiMessage;
  if (error.code === 'ERR_NETWORK') return 'No se pudo conectar al servidor.';
  return 'Ocurrió un error. Intentá nuevamente más tarde.';
}

axios.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;

    // 401 → sesión expirada / no autenticado. Limpiar y mandar a login (sin toast).
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Resto de errores (4xx no-401, 5xx, network) → toast usando el render M3.
    const text = extractMessage(error);
    toast.custom(
      (id) => <Snackbar id={id} text={text} severity="error" />,
      { duration: 5000 }
    );

    return Promise.reject(error);
  }
);

export default axios;
