import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllVendors, addVendor, updateVendor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar, FormInput, FormSelect, Button, Alert, Card } from '../components/common';
import { logout } from '../services/api';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
    address: '',
    phone: '',
    status: 'Active',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout: logoutAuth } = useAuth();

  const categories = [
    { label: 'Catering', value: 'Catering' },
    { label: 'Florist', value: 'Florist' },
    { label: 'Decoration', value: 'Decoration' },
    { label: 'Lighting', value: 'Lighting' },
  ];

  const statuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  useEffect(() => {
    fetchVendors();
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

  const fetchVendors = async () => {
    try {
      const response = await getAllVendors();
      setVendors(response.data.vendors);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vendors');
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
      category: '',
      address: '',
      phone: '',
      status: 'Active',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.category || !formData.address || !formData.phone) {
      setError('All fields are required');
      return;
    }

    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await updateVendor(editingId, updateData);
        setSuccess('Vendor updated successfully');
      } else {
        if (!formData.password) {
          setError('Password required for new vendor');
          return;
        }
        await addVendor(formData);
        setSuccess('Vendor added successfully');
      }
      resetForm();
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (vendor) => {
    setFormData({
      name: vendor.name,
      email: vendor.email,
      password: '',
      category: vendor.category,
      address: vendor.address,
      phone: vendor.phone,
      status: vendor.status,
    });
    setEditingId(vendor._id);
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
        title="Vendor Management"
        links={[
          { label: 'Back to Maintain Vendor', href: '/admin/vendors' },
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />
      <div className="page container">
        <h1 className="page-title">Vendor Management (Add / Update)</h1>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div style={{ marginBottom: '2rem' }}>
          <Button
            label={showForm ? 'Cancel' : 'Add New Vendor'}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            variant="primary"
          />
        </div>

        {showForm && (
          <Card title={editingId ? 'Edit Vendor' : 'Add New Vendor'}>
            <form onSubmit={handleSubmit}>
              <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
              <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              {!editingId && (
                <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              )}
              <FormSelect label="Category" name="category" options={categories} value={formData.category} onChange={handleChange} required />
              <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} required />
              <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
              <FormSelect label="Status" name="status" options={statuses} value={formData.status} onChange={handleChange} />

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
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.category}</td>
                  <td>{vendor.status}</td>
                  <td>
                    <Button label="Edit" onClick={() => handleEdit(vendor)} variant="secondary" />
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

export default VendorManagement;
