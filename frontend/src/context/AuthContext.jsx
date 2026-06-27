import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';

const AuthContext = createContext();
const API = import.meta.env.DEV ? 'http://localhost:8000/api/auth' : '/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart, setUserId } = useCart();

  /** On mount: restore session from localStorage */
  useEffect(() => {
    const token     = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_data');
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setUserId(parsed.id); // ← load that user's cart
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/login/`, { email, password });
    const { access, user: userData } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setUserId(userData.id); // ← switch cart to this user's cart
    return userData;
  };

  const register = async (formData) => {
    await axios.post(`${API}/register/`, formData);
    return login(formData.email, formData.password);
  };

  const logout = useCallback(() => {
    // 1. Clear auth tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');

    // 2. Clear the cart state + storage immediately
    clearCart();
    setUserId(null); // ← reset to guest / empty cart

    // 3. Clear user state
    setUser(null);
  }, [clearCart, setUserId]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
