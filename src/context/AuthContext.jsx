import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Axios instance with default base URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:3001/api'
  });

  // Set default auth header if token exists
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  const [uploadProgress, setUploadProgress] = useState({ isOpen: false, percent: 0, text: '' });

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const startProgress = (text) => setUploadProgress({ isOpen: true, percent: 0, text: text || 'Đang tải dữ liệu...' });
  const updateProgress = (percent, text) => setUploadProgress(prev => ({ ...prev, percent, text: text || prev.text }));
  const finishProgress = (text) => setUploadProgress({ isOpen: true, percent: 100, text: text || 'Hoàn tất!' });
  const closeProgress = () => setUploadProgress({ isOpen: false, percent: 0, text: '' });

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      api,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      setAuthModalMode,
      uploadProgress,
      startProgress,
      updateProgress,
      finishProgress,
      closeProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
};
