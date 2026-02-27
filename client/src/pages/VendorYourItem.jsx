import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';

const VendorYourItem = () => {
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

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
    <div className="vendor-subpage-layout">
      <div className="vendor-subpage-panel">
        <div className="vendor-subpage-top-row">
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/main')}>
            Home
          </button>
          <div className="vendor-subpage-title">Your Item</div>
          <button type="button" className="vendor-action-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        <div className="vendor-options-row">
          <button type="button" className="vendor-option-box" onClick={() => navigate('/vendor/add-new-item')}>
            Insert New Item
          </button>
          <button type="button" className="vendor-option-box" onClick={() => navigate('/vendor/delete-item')}>
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorYourItem;
