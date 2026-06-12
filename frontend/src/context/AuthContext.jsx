import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = 'http://localhost:8000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_data');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
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
    return userData;
  };

  const register = async (formData) => {
    await axios.post(`${API}/register/`, formData);
    return login(formData.email, formData.password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
