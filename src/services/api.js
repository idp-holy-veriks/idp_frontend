// idp_frontend/src/services/api.js

import axios from 'axios';

// Crearea instanțelor separate pentru serviciile de auth și backend
const authAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_AUTH_SERVICE_URL || 'http://auth_service:8080')
    : 'http://localhost:8080',
});

const backendAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_BACKEND_SERVICE_URL || 'http://backend:8000')
    : 'http://localhost:8000',
});

// Adaugă interceptor pentru atașarea token-ului JWT la toate cererile către backend
backendAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor pentru gestionarea erorilor (opțional)
const errorInterceptor = (error) => {
  // Gestionarea erorilor 401 Unauthorized (token expirat)
  if (error.response && error.response.status === 401) {
    // Redirect la pagina de login sau refresh token
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authAPI.interceptors.response.use(response => response, errorInterceptor);
backendAPI.interceptors.response.use(response => response, errorInterceptor);

export { authAPI, backendAPI };