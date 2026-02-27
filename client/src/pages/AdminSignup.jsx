import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const categories = [
    { label: 'Event Management', value: 'Event Management' },
    { label: 'Support', value: 'Support' },
    { label: 'Operations', value: 'Operations' },
    { label: 'Finance', value: 'Finance' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.category) {
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
      const response = await adminSignup(formData);
      if (response.data.success) {
        setSuccess('Signup successful! Redirecting...');
        login(response.data.admin, response.data.token);
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="legacy-signup-page">
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
          <div className="legacy-signup-row">
            <label htmlFor="category" className="legacy-signup-label">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="legacy-signup-input" required>
              <option value="">Drop Down</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
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

export default AdminSignup;
