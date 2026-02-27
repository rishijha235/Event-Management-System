import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Button } from '../components/common';

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    { title: 'Admin', desc: 'Manage users, vendors, and memberships', path: '/admin/login' },
    { title: 'Vendor', desc: 'Add and manage products, handle orders', path: '/vendor/login' },
    { title: 'User', desc: 'Browse vendors, shop, and checkout', path: '/user/login' },
  ];

  return (
    <div>
      <Navbar title="Event Management System" />
      <div className="page container">
        <h1 className="page-title">Welcome to Event Management System</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem', color: '#666' }}>
          Select your role to login or signup
        </p>

        <div className="dashboard-grid">
          {roles.map((role, idx) => (
            <div key={idx} className="dashboard-card" style={{ cursor: 'auto' }}>
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
              <Button
                label={`${role.title} Login`}
                onClick={() => navigate(role.path)}
                variant="success"
                block
              />
              {role.title !== 'Vendor' && (
                <Button
                  label={`${role.title} Signup`}
                  onClick={() => navigate(`/${role.title.toLowerCase()}/signup`)}
                  variant="secondary"
                  block
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
