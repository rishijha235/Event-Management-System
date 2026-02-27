import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllUsers, addUser, updateUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar, FormInput, Button, Alert, Card } from '../components/common';
import { logout } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const requestedMode = searchParams.get('mode');
    if (requestedMode === 'add') {
      setShowForm(true);
      setEditingId(null);
    }
    if (requestedMode === 'update') {
      setShowForm(false);
      setEditingId(null);
    }
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      phone: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!editingId && !formData.password)) {
      setError('Required fields missing');
      return;
    }

    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await updateUser(editingId, updateData);
        setSuccess('User updated successfully');
      } else {
        await addUser(formData);
        setSuccess('User added successfully');
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pinCode: user.pinCode || '',
      phone: user.phone || '',
    });
    setEditingId(user._id);
    setShowForm(true);
  };

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
    <div>
      <Navbar
        title="User Management"
        links={[
          { label: 'Back to Maintain User', href: '/admin/users' },
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />
      <div className="page container">
        <h1 className="page-title">User Management (Add / Update)</h1>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div style={{ marginBottom: '2rem' }}>
          <Button
            label={showForm ? 'Cancel' : 'Add New User'}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            variant="primary"
          />
        </div>

        {showForm && (
          <Card title={editingId ? 'Edit User' : 'Add New User'}>
            <form onSubmit={handleSubmit}>
              <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
              <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              {!editingId && (
                <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              )}
              <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} />
              <FormInput label="City" name="city" value={formData.city} onChange={handleChange} />
              <FormInput label="State" name="state" value={formData.state} onChange={handleChange} />
              <FormInput label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />
              <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button label="Submit" type="submit" variant="success" block />
                <Button label="Cancel" onClick={resetForm} variant="secondary" block />
              </div>
            </form>
          </Card>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.city || '-'}</td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <Button label="Edit" onClick={() => handleEdit(user)} variant="secondary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
