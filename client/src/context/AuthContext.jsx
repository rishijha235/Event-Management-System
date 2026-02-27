import React, { createContext, useState, useEffect } from 'react';
import { getCurrentSession, setAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);
      setAuthToken(savedToken);

      try {
        const response = await getCurrentSession();
        if (response.data?.success && response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthToken(authToken);
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
