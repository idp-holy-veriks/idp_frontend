import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [localError, setLocalError] = useState(null); // Adăugăm o stare locală pentru eroare
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  // Monitorizăm schimbările în eroarea globală
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  /**
   * Gestionează schimbările în formular
   * @param {Object} e - Event-ul de change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));

    // Optional: Șterge eroarea când utilizatorul începe să tasteze din nou
    if (localError) {
      setLocalError(null);
    }
  };

  /**
   * Gestionează trimiterea formularului
   * @param {Object} e - Event-ul de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await login(credentials);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      // Captăm eroarea și o setăm în starea locală
      setLocalError(err.detail || 'Login failed. Please check your credentials.');

      // Nu se va șterge automat - va rămâne vizibilă până când:
      // 1. Utilizatorul face o modificare în formular
      // 2. Se face un alt submit cu succes
    }
  };

  // Opțional: Adaugă un buton pentru a șterge manual eroarea
  const clearError = () => {
    setLocalError(null);
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2>Login</h2>
        {localError && (
          <div className="error-message">
            {localError}
            {/* Opțional: adaugă un buton de închidere */}
            <button
              className="close-error-btn"
              onClick={clearError}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="form-footer">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;