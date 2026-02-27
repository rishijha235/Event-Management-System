import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout: logoutAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      logoutAuth();
      navigate('/index');
    } catch (err) {
      logoutAuth();
      navigate('/index');
    }
  };

  return (
    <div className="admin-dash-page">
      <div className="admin-dash-panel">
        <div className="admin-dash-top-row">
          <button
            type="button"
            className="btn btn-primary admin-dash-top-btn"
            onClick={() => navigate('/index')}
          >
            Home
          </button>
          <button
            type="button"
            className="btn btn-danger admin-dash-top-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <h1 className="admin-dash-title">Admin Dashboard</h1>
        <p className="admin-dash-subtitle">Welcome {user?.name || 'Admin'}</p>

        <div className="admin-dash-center-actions">
          <button
            type="button"
            className="btn btn-success admin-dash-main-btn"
            onClick={() => navigate('/admin/users')}
          >
            Maintain User
          </button>
          <button
            type="button"
            className="btn btn-success admin-dash-main-btn"
            onClick={() => navigate('/admin/vendors')}
          >
            Maintain Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
