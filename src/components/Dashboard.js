import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Utilizator';

  const handleLogout = () => {
    // Ștergem token-ul și username-ul la logout
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <h1>IDP Shop</h1>
        </div>
        <div className="user-controls">
          <span className="welcome-message">Bine ai venit, {username}!</span>
          <button onClick={handleLogout} className="logout-button">
            Delogare
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Felicitări! Ai accesat dashboard-ul.</p>
        <p>Aici vor fi afișate produsele și alte funcționalități ale aplicației.</p>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 IDP Shop. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
};

export default Dashboard;