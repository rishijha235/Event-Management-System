import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const UserLogin = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.password) {
      setError('User Id and Password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await userLogin({
        userId: formData.userId,
        password: formData.password
      });
      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ userId: '', password: '' });
    setError('');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-panel">
        <div className="admin-login-title">Event Management System</div>

        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-row">
            <label htmlFor="userId" className="admin-login-label">User Id</label>
            <input
              id="userId"
              name="userId"
              type="text"
              value={formData.userId}
              onChange={handleChange}
              className="admin-login-input"
              required
            />
          </div>

          <div className="admin-login-row">
            <label htmlFor="password" className="admin-login-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="admin-login-input"
              required
            />
          </div>

          <div className="admin-login-actions">
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" className="admin-login-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
      <div className="admin-login-footer-space"></div>
    </div>
  );
};

export default UserLogin;
