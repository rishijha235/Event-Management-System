import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addGuest, deleteGuest, getGuests, updateGuest, logout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar, Alert, Button, FormInput } from '../components/common';

const GuestList = () => {
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  const [guests, setGuests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await getGuests();
      setGuests(response.data.guests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch guest list');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError('Guest name is required');
      return;
    }

    try {
      if (editingId) {
        await updateGuest(editingId, formData);
        setSuccess('Guest updated successfully');
      } else {
        await addGuest(formData);
        setSuccess('Guest added successfully');
      }
      resetForm();
      fetchGuests();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (guest) => {
    setEditingId(guest._id);
    setFormData({ name: guest.name || '', email: guest.email || '', phone: guest.phone || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this guest?')) return;
    try {
      await deleteGuest(id);
      setSuccess('Guest deleted successfully');
      fetchGuests();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
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
        title="Guest List"
        links={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />

      <div className="page container">
        <h1 className="page-title">Guest List (Update / Delete)</h1>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button label={editingId ? 'Update' : 'Add'} type="submit" variant="success" />
              {editingId && <Button label="Cancel" variant="secondary" onClick={resetForm} />}
            </div>
          </form>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest._id}>
                  <td>{guest.name}</td>
                  <td>{guest.email || '-'}</td>
                  <td>{guest.phone || '-'}</td>
                  <td>
                    <Button label="Update" variant="secondary" onClick={() => handleEdit(guest)} />
                    <Button label="Delete" variant="danger" onClick={() => handleDelete(guest._id)} />
                  </td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No guests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestList;
