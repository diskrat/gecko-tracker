import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/bff', // Backend rodando no container Docker
});

// Adiciona token automaticamente em cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de Usuário
export const userService = {
  // Autenticação
  login: async (credentials) => {
    const form = new URLSearchParams();
    form.append('username', credentials.username);
    form.append('password', credentials.password);

    const response = await api.post('/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  // Cadastro
  signup: async (userData) => {
    const response = await api.post('/signup', userData);
    return response.data;
  },

  // Usuário logado
  getCurrentUser: async () => {
    const response = await api.get('/logado');
    return response.data;
  },

  // Listar usuários
  getUsers: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Obter usuário por ID
  getUser: async (userId) => {
    const response = await api.get(`/${userId}`);
    return response.data;
  },

  // Atualizar usuário
  updateUser: async (userId, userData) => {
    const response = await api.put(`/${userId}`, userData);
    return response.data;
  },

  // Deletar usuário
  deleteUser: async (userId) => {
    await api.delete(`/${userId}`);
  }
};

// Serviços de Criptomoedas
export const cryptoService = {
  // Listar criptomoedas com paginação
  getCryptocurrencies: async (params = {}) => {
    const { currency = 'usd', page = 1, per_page = 10 } = params;
    const response = await api.get('/cryptocurrencies', {
      params: { currency, page, per_page }
    });
    return response.data;
  },

  // Histórico de preços
  getCryptocurrencyHistory: async (id, params = {}) => {
    const { currency = 'usd', start_date, end_date } = params;
    const response = await api.get(`/cryptocurrencies/${id}/history`, {
      params: { currency, start_date, end_date }
    });
    return response.data;
  }
};

// Serviços de Mercado
export const marketService = {
  // Resumo do mercado
  getMarketSummary: async (currency = 'usd') => {
    const response = await api.get('/market/summary', {
      params: { currency }
    });
    return response.data;
  }
};

// Serviços de Favoritos
export const favoriteService = {
  // Adicionar favorito
  addFavorite: async (coin_id) => {
    const response = await api.post('/favorites', { coin_id });
    return response.data;
  },

  // Listar favoritos
  getFavorites: async () => {
    const response = await api.get('/favorites/all');
    return response.data;
  },

  // Remover favorito
  removeFavorite: async (favoriteId) => {
    await api.delete(`/favorites/${favoriteId}`);
  }
};

export default api;
