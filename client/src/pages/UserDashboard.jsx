import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Button } from '../components/common';
import { logout } from '../services/api';

const UserDashboard = () => {
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

  const options = [
    { title: 'Vendors', desc: 'Browse vendors by category', path: '/user/vendors' },
    { title: 'Cart', desc: 'View your shopping cart', path: '/user/cart' },
    { title: 'Guest List', desc: 'Update and delete guest entries', path: '/user/guest-list' },
    { title: 'Order Status', desc: 'Track your orders', path: '/user/orders' },
  ];

  return (
    <div>
      <Navbar
        title="User Dashboard"
        links={[
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />
      <div className="page container">
        <h1 className="page-title">Welcome {user?.name}</h1>

        <div className="dashboard-grid">
          {options.map((opt, idx) => (
            <div key={idx} className="dashboard-card">
              <h3>{opt.title}</h3>
              <p>{opt.desc}</p>
              <Button
                label="Access"
                onClick={() => navigate(opt.path)}
                variant="success"
                block
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
