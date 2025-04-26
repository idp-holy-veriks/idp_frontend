import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/login`, {
        name: username,
        password: password
      });

      const { access_token } = response.data;

      // Salvăm token-ul în localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('username', username);

      // Redirecționăm către pagina principală
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Nume utilizator sau parolă incorecte');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Autentificare</h2>
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nume utilizator</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
              placeholder="Introduceți numele de utilizator"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Introduceți parola"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Se procesează...' : 'Autentificare'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Nu aveți cont? <Link to="/register">Înregistrați-vă aici</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;