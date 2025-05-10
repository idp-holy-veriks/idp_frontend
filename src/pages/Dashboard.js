import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to your Dashboard</h1>
        <p>Hello, {user?.name}! Here you can manage your account and orders.</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>User Profile</h2>
          </div>
          <div className="card-body">
            <div className="profile-info">
              <p><strong>Username:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
            </div>
            <Link to="/profile/edit" className="button">Edit Profile</Link>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Products</h2>
            </div>
            <div className="card-body">
              <p>Browse and purchase products from our catalog.</p>
              <Link to="/products" className="button">View Products</Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Your Basket</h2>
            </div>
            <div className="card-body">
              <p>View items in your shopping basket and proceed to checkout.</p>
              <Link to="/basket" className="button">View Basket</Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Order History</h2>
            </div>
            <div className="card-body">
              <p>View your past orders and track current ones.</p>
              <Link to="/orders" className="button">View Orders</Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Settings</h2>
            </div>
            <div className="card-body">
              <p>Manage your account settings and preferences.</p>
              <Link to="/settings" className="button">Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;