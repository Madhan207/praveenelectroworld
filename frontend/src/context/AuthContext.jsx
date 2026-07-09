import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useCart } from './CartContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart, setUserId } = useCart();

  /** On mount: restore session from localStorage */
  useEffect(() => {
    const token     = sessionStorage.getItem('access_token');
    const savedUser = sessionStorage.getItem('user_data');
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setUserId(parsed.id);
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post(`/auth/login/`, { email, password });
    const { access, refresh, user: userData } = res.data;
    sessionStorage.setItem('access_token',  access);
    sessionStorage.setItem('refresh_token', refresh);   // ← store refresh token
    sessionStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setUserId(userData.id);
    return userData;
  };

  const register = async (formData) => {
    await api.post(`/auth/register/`, formData);
    return login(formData.email, formData.password);
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user_data');
    clearCart();
    setUserId(null);
    setUser(null);
  }, [clearCart, setUserId]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
