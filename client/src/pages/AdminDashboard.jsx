import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common';
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
    <div className="page container">
      <h1 className="page-title">Admin Dashboard</h1>
      <div style={{ maxWidth: '360px', display: 'grid', gap: '12px' }}>
        <Button
          label="Home"
          onClick={() => navigate('/index')}
          variant="primary"
          block
        />
        <Button
          label="Maintain User"
          onClick={() => navigate('/admin/users')}
          variant="success"
          block
        />
        <Button
          label="Maintain Vendor"
          onClick={() => navigate('/admin/vendors')}
          variant="success"
          block
        />
        <Button
          label="Logout"
          onClick={handleLogout}
          variant="danger"
          block
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
