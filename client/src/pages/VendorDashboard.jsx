import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';
import { logout, getVendorDashboardData } from '../services/api';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout: logoutAuth } = useAuth();
  const [vendorInfo, setVendorInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendorDashboard = async () => {
      try {
        const response = await getVendorDashboardData();
        setVendorInfo(response.data.vendor);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load vendor data');
      }
    };

    fetchVendorDashboard();
  }, []);

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
    <div className="vendor-page-layout">
      <div className="vendor-page-panel">
        <Alert type="error" message={error} />

        <div className="vendor-welcome-box">
          <p>Welcome</p>
          <p>{vendorInfo?.name || user?.name || 'Vendor'}</p>
        </div>

        <div className="vendor-action-row">
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/your-item')}>
            Your Item
          </button>
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/add-new-item')}>
            Add New Item
          </button>
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/transaction')}>
            Transaction
          </button>
          <button type="button" className="vendor-action-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
