import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequestItems, logout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const VendorRequestItem = () => {
  const [requestItems, setRequestItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllRequestItems();
        setRequestItems(response.data.requestItems || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch request items');
      }
    };

    fetchItems();
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

  const requestedItems = requestItems.slice(0, 4);

  return (
    <div className="vendor-subpage-layout">
      <div className="vendor-top-label">Vender</div>
      <div className="vendor-subpage-panel">
        <Alert type="error" message={error} />

        <div className="vendor-subpage-top-row">
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/main')}>
            Home
          </button>
          <div className="vendor-subpage-title">Request Item</div>
          <button type="button" className="vendor-action-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        <div className="vendor-product-cards">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="vendor-request-box">
              {requestedItems[index]?.image ? (
                <img src={requestedItems[index].image} alt={requestedItems[index].itemName} className="vendor-inline-image" />
              ) : null}
              <p>{requestedItems[index]?.itemName || `Item ${index + 1}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorRequestItem;
