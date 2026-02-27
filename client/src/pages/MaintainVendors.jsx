import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';

const MaintainVendors = () => {
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
    <div className="maintain-user-page">
      <div className="maintain-user-panel">
        <div className="maintain-user-top-row">
          <button type="button" className="maintain-user-btn" onClick={() => navigate('/admin/dashboard')}>
            Home
          </button>
          <button type="button" className="maintain-user-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        <div className="maintain-user-grid">
          <button
            type="button"
            className="maintain-user-btn maintain-user-label-btn"
            onClick={() => navigate('/admin/vendor-membership')}
          >
            Membership
          </button>
          <div className="maintain-user-action-col">
            <button
              type="button"
              className="maintain-user-btn"
              onClick={() => navigate('/admin/vendor-membership?mode=add')}
            >
              Add
            </button>
            <button
              type="button"
              className="maintain-user-btn"
              onClick={() => navigate('/admin/vendor-membership?mode=update')}
            >
              Update
            </button>
          </div>

          <button
            type="button"
            className="maintain-user-btn maintain-user-label-btn"
            onClick={() => navigate('/admin/vendor-management')}
          >
            Vendor Management
          </button>
          <div className="maintain-user-action-col">
            <button
              type="button"
              className="maintain-user-btn"
              onClick={() => navigate('/admin/vendor-management?mode=add')}
            >
              Add
            </button>
            <button
              type="button"
              className="maintain-user-btn"
              onClick={() => navigate('/admin/vendor-management?mode=update')}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintainVendors;
