import { useState, useEffect, createContext, useContext } from 'react';
import { userService } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se existe token e usuário válido ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkCurrentUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      localStorage.setItem('token', response.access_token);

      // Buscar dados do usuário após login
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao fazer login'
      };
    }
  };

  const signup = async (userData) => {
    try {
      await userService.signup(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao criar conta'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
