import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSignup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await userSignup(formData);
      if (response.data.success) {
        setSuccess('Signup successful! Redirecting...');
        login(response.data.user, response.data.token);
        setTimeout(() => navigate('/user/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="legacy-signup-page">
      <div className="legacy-auth-header-buttons">
        <button type="button" className="legacy-small-top-btn" onClick={() => navigate('/index')}>Chart</button>
        <button type="button" className="legacy-small-top-btn" onClick={() => navigate('/index')}>Back</button>
      </div>
      <div className="legacy-signup-card">
        <div className="legacy-auth-title">Event Management System</div>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <form onSubmit={handleSubmit} className="legacy-signup-form">
          <div className="legacy-signup-row">
            <label htmlFor="name" className="legacy-signup-label">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} className="legacy-signup-input" required />
          </div>
          <div className="legacy-signup-row">
            <label htmlFor="email" className="legacy-signup-label">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="legacy-signup-input" required />
          </div>
          <div className="legacy-signup-row">
            <label htmlFor="password" className="legacy-signup-label">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="legacy-signup-input" required />
          </div>

          <div className="legacy-signup-submit-wrap">
            <button type="submit" className="legacy-signup-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
