import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/auth';

// Crearea context-ului de autentificare
const AuthContext = createContext();

/**
 * Provider pentru context-ul de autentificare
 * @param {Object} props - Props-urile componentei
 * @returns {JSX.Element} - Provider-ul de context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Încarcă utilizatorul la montarea componentei
    const loadUser = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Error loading user:', err);
          setError(err.detail || 'Authentication failed');
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Autentifică un utilizator
   * @param {Object} credentials - Credențialele utilizatorului
   * @returns {Promise<Boolean>} - true dacă autentificarea a reușit
   */
  const login = async (credentials) => {
  setLoading(true);
  try {
    await AuthService.login(credentials);
    const userData = await AuthService.getCurrentUser();
    setUser(userData);
    setError(null);
    return true;
  } catch (err) {
    console.error('Login error:', err);
    setError(err.detail || 'Login failed');
    return false; // Returnăm false în caz de eroare
  } finally {
    setLoading(false);
  }
  };

  /**
   * Înregistrează un utilizator nou
   * @param {Object} userData - Datele utilizatorului
   * @returns {Promise<Boolean>} - true dacă înregistrarea a reușit
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      await AuthService.register(userData);
      setError(null);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.detail || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delogează utilizatorul curent
   */
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  // Valoarea context-ului
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook pentru utilizarea context-ului de autentificare
 * @returns {Object} - Context-ul de autentificare
 */
export const useAuth = () => useContext(AuthContext);