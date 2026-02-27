import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const VendorLogin = () => {
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
      const response = await vendorLogin({
        userId: formData.userId,
        password: formData.password,
      });
      if (response.data.success) {
        login(response.data.vendor, response.data.token);
        navigate('/vendor/dashboard');
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
    <div className="legacy-signup-page">
      <div className="legacy-auth-header-buttons">
        <button type="button" className="legacy-small-top-btn" onClick={() => navigate('/index')}>CHART</button>
        <button type="button" className="legacy-small-top-btn" onClick={() => navigate('/index')}>BACK</button>
      </div>
      <div className="legacy-auth-card">
        <div className="legacy-auth-title">Event Management System</div>
        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} className="legacy-signup-form">
          <div className="legacy-signup-row">
            <label htmlFor="userId" className="legacy-signup-label">User Id</label>
            <input
              id="userId"
              name="userId"
              type="text"
              value={formData.userId}
              onChange={handleChange}
              className="legacy-signup-input"
              required
            />
          </div>

          <div className="legacy-signup-row">
            <label htmlFor="password" className="legacy-signup-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="legacy-signup-input"
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
    </div>
  );
};

export default VendorLogin;
