// idp_frontend/src/services/auth.js

import { authAPI, backendAPI } from './api';

export const AuthService = {
  /**
   * Înregistrează un utilizator nou prin serviciul de autentificare
   * @param {Object} userData - Datele utilizatorului (name, email, password)
   * @returns {Promise} - Răspunsul de la server
   */
  async register(userData) {
    try {
      // Folosim authAPI pentru register (către serviciul de autentificare)
      const response = await authAPI.post('/register', userData);
      console.log('Înregistrare reușită:', response.data);
      return response.data;
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      throw error.response?.data || { detail: 'Registration failed' };
    }
  },

  /**
   * Autentifică un utilizator prin serviciul de autentificare
   * @param {Object} credentials - Credențialele utilizatorului (name, password)
   * @returns {Promise} - Token-ul JWT și tipul
   */
  async login(credentials) {
    try {
      // Folosim authAPI pentru login
      const response = await authAPI.post('/login', credentials);
      // Salvează token-ul în localStorage pentru utilizare ulterioară
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Eroare la login:', error);
      throw error.response?.data || { detail: 'Login failed' };
    }
  },

  /**
   * Delogează utilizatorul curent
   */
  logout() {
    localStorage.removeItem('token');
  },

  /**
   * Verifică dacă utilizatorul este autentificat
   * @returns {Boolean} - true dacă utilizatorul este autentificat
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Obține token-ul JWT
   * @returns {String|null} - Token-ul JWT sau null dacă nu există
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Obține informațiile utilizatorului curent
   * @returns {Promise} - Datele utilizatorului
   */
  async getCurrentUser() {
    try {
      const response = await backendAPI.get('/users/me');
      return response.data;
    } catch (error) {
      // În caz de token expirat sau invalid, delogăm utilizatorul
      if (error.response && error.response.status === 401) {
        this.logout();
      }
      throw error.response?.data || { detail: 'Failed to get user information' };
    }
  }
};