import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllMemberships, addMembership, updateMembership, getAllUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar, FormInput, FormSelect, FormRadio, Button, Alert, Card } from '../components/common';
import { logout } from '../services/api';

const Membership = () => {
  const [memberships, setMemberships] = useState([]);
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState('view');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
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
      const [membRes, userRes] = await Promise.all([
        getAllMemberships(),
        getAllUsers(),
      ]);
      setMemberships(membRes.data.memberships);
      setUsers(userRes.data.users);
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
    if (!formData.userId || !formData.duration) {
      setError('All fields required');
      return;
    }

    try {
      await addMembership({
        userId: formData.userId,
        duration: formData.duration,
      });
      setSuccess('Membership added successfully');
      setFormData({ userId: '', duration: '6 months', membershipNumber: '', status: 'Active' });
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
      await updateMembership(formData.membershipNumber, {
        duration: formData.duration,
        status: formData.status,
      });
      setSuccess('Membership updated successfully');
      setFormData({ userId: '', duration: '6 months', membershipNumber: '', status: 'Active' });
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
        title="Membership Management"
        links={[
          { label: 'Back to Dashboard', href: '/admin/dashboard' },
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />
      <div className="page container">
        <h1 className="page-title">Membership Module (Admin Access)</h1>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <Button
            label="View Memberships"
            onClick={() => { setMode('view'); setFormData({ userId: '', duration: '6 months', membershipNumber: '', status: 'Active' }); }}
            variant={mode === 'view' ? 'success' : 'secondary'}
          />
          <Button
            label="Add Membership"
            onClick={() => { setMode('add'); setFormData({ userId: '', duration: '6 months', membershipNumber: '', status: 'Active' }); }}
            variant={mode === 'add' ? 'success' : 'secondary'}
          />
          <Button
            label="Update Membership"
            onClick={() => { setMode('update'); setFormData({ userId: '', duration: '6 months', membershipNumber: '', status: 'Active' }); }}
            variant={mode === 'update' ? 'success' : 'secondary'}
          />
        </div>

        {mode === 'add' && (
          <Card title="Add Membership">
            <form onSubmit={handleAddMembership}>
              <FormSelect
                label="Select User"
                name="userId"
                options={users.map(u => ({ label: `${u.name} (${u.email})`, value: u._id }))}
                value={formData.userId}
                onChange={handleChange}
                required
              />
              <FormRadio
                label="Duration (6 months is default)"
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
                  <th>User</th>
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
                    <td>{mem.user?.name || '-'}</td>
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

export default Membership;
