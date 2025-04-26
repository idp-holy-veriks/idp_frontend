import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

// Componenta pentru verificarea autentificării
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    // Redirecționare către login dacă utilizatorul nu e autentificat
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rută publică pentru login */}
          <Route path="/login" element={<Login />} />

          {/* Rută publică pentru înregistrare */}
          <Route path="/register" element={<Register />} />

          {/* Rută protejată pentru dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirecționare către login pentru ruta principală */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rută pentru orice altă adresă necunoscută */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;