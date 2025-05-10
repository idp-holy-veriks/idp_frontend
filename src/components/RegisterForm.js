import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  /**
   * Gestionează schimbările în formular
   * @param {Object} e - Event-ul de change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Gestionează schimbarea confirmării parolei
   * @param {Object} e - Event-ul de change
   */
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== userData.password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  /**
   * Validează datele formularului
   * @returns {Boolean} - true dacă datele sunt valide
   */
  const validateForm = () => {
    if (userData.password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  /**
   * Gestionează trimiterea formularului
   * @param {Object} e - Event-ul de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await register(userData);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
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
              value={userData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="8"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              disabled={loading}
              minLength="8"
            />
            {passwordError && (
              <div className="password-error">{passwordError}</div>
            )}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || passwordError}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <div className="form-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
