import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllVendorMemberships, addVendorMembership, updateVendorMembership, getAllVendors } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar, FormInput, FormSelect, FormRadio, Button, Alert, Card } from '../components/common';
import { logout } from '../services/api';

const VendorMembership = () => {
  const [memberships, setMemberships] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [mode, setMode] = useState('view');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    vendorId: '',
    duration: '6 months',
    membershipNumber: '',
    status: 'Active',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const requestedMode = searchParams.get('mode');
    if (requestedMode === 'add' || requestedMode === 'update' || requestedMode === 'view') {
      setMode(requestedMode);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const [membRes, vendRes] = await Promise.all([
        getAllVendorMemberships(),
        getAllVendors(),
      ]);
      setMemberships(membRes.data.memberships);
      setVendors(vendRes.data.vendors);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMembership = async (e) => {
    e.preventDefault();
    if (!formData.vendorId || !formData.duration) {
      setError('All fields required');
      return;
    }

    try {
      await addVendorMembership({
        vendorId: formData.vendorId,
        duration: formData.duration,
      });
      setSuccess('Membership added successfully');
      setFormData({ vendorId: '', duration: '6 months', membershipNumber: '', status: 'Active' });
      setMode('view');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleUpdateMembership = async (e) => {
    e.preventDefault();
    if (!formData.membershipNumber) {
      setError('Membership number required');
      return;
    }

    try {
      await updateVendorMembership(formData.membershipNumber, {
        duration: formData.duration,
        status: formData.status,
      });
      setSuccess('Membership updated successfully');
      setFormData({ vendorId: '', duration: '6 months', membershipNumber: '', status: 'Active' });
      setMode('view');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
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
        title="Vendor Membership Management"
        links={[
          { label: 'Back to Maintain Vendor', href: '/admin/vendors' },
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />
      <div className="page container">
        <h1 className="page-title">Membership Module (Vendor)</h1>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <Button
            label="View Memberships"
            onClick={() => { setMode('view'); setFormData({ vendorId: '', duration: '6 months', membershipNumber: '', status: 'Active' }); }}
            variant={mode === 'view' ? 'success' : 'secondary'}
          />
          <Button
            label="Add Membership"
            onClick={() => { setMode('add'); setFormData({ vendorId: '', duration: '6 months', membershipNumber: '', status: 'Active' }); }}
            variant={mode === 'add' ? 'success' : 'secondary'}
          />
          <Button
            label="Update Membership"
            onClick={() => { setMode('update'); setFormData({ vendorId: '', duration: '6 months', membershipNumber: '', status: 'Active' }); }}
            variant={mode === 'update' ? 'success' : 'secondary'}
          />
        </div>

        {mode === 'add' && (
          <Card title="Add Membership">
            <form onSubmit={handleAddMembership}>
              <FormSelect
                label="Select Vendor"
                name="vendorId"
                options={vendors.map(v => ({ label: `${v.name} (${v.email})`, value: v._id }))}
                value={formData.vendorId}
                onChange={handleChange}
                required
              />
              <FormRadio
                label="Duration"
                name="duration"
                options={[
                  { label: '6 months', value: '6 months' },
                  { label: '1 year', value: '1 year' },
                  { label: '2 years', value: '2 years' },
                ]}
                value={formData.duration}
                onChange={handleChange}
                required
              />
              <Button label="Add Membership" type="submit" variant="success" block />
            </form>
          </Card>
        )}

        {mode === 'update' && (
          <Card title="Update Membership">
            <form onSubmit={handleUpdateMembership}>
              <FormInput
                label="Membership Number"
                name="membershipNumber"
                value={formData.membershipNumber}
                onChange={handleChange}
                placeholder="Enter membership number"
                required
              />
              <FormRadio
                label="Status"
                name="status"
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Cancelled', value: 'Cancelled' },
                ]}
                value={formData.status}
                onChange={handleChange}
                required
              />
              <FormRadio
                label="Duration"
                name="duration"
                options={[
                  { label: '6 months', value: '6 months' },
                  { label: '1 year', value: '1 year' },
                  { label: '2 years', value: '2 years' },
                ]}
                value={formData.duration}
                onChange={handleChange}
              />
              <Button label="Update Membership" type="submit" variant="success" block />
            </form>
          </Card>
        )}

        {mode === 'view' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Membership #</th>
                  <th>Vendor</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>End Date</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((mem) => (
                  <tr key={mem._id}>
                    <td>{mem.membershipNumber}</td>
                    <td>{mem.vendor?.name || '-'}</td>
                    <td>{mem.duration}</td>
                    <td>{mem.status}</td>
                    <td>{new Date(mem.endDate).toLocaleDateString()}</td>
                    <td>₹{mem.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorMembership;
