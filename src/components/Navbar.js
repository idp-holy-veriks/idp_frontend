import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BasketService } from '../services/basket';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [basketCount, setBasketCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBasketCount();
    }
  }, [isAuthenticated]);

  const fetchBasketCount = async () => {
    try {
      const basketItems = await BasketService.getBasket();
      const itemCount = basketItems.reduce((count, item) => count + item.quantity, 0);
      setBasketCount(itemCount);
    } catch (error) {
      console.error('Error fetching basket count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">IDP Shop</Link>
      </div>

      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <div className="navbar-start">
              <Link to="/dashboard" className="navbar-item">Dashboard</Link>
              <Link to="/products" className="navbar-item">Products</Link>
              <Link to="/orders" className="navbar-item">Orders</Link>
            </div>

            <div className="navbar-end">
              <Link to="/basket" className="navbar-item basket-link">
                <span className="basket-icon">🛒</span>
                {basketCount > 0 && (
                  <span className="basket-count">{basketCount}</span>
                )}
              </Link>

              <div className="user-info">
                <span>Welcome, {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-end">
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;