import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Local preparado para autenticação futura
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message =
        data?.message ||
        (status === 404 ? 'Recurso não encontrado.' : 'Erro ao processar a solicitação.');

      console.error(`API Error [${status}]:`, message);

      // Repassar mensagem amigável junto ao erro para uso nos hooks
      error.friendlyMessage = message;
    } else if (error.request) {
      error.friendlyMessage = 'Sem resposta do servidor. Verifique sua conexão.';
      console.error('Network Error:', error.request);
    } else {
      error.friendlyMessage = 'Erro inesperado. Tente novamente.';
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
