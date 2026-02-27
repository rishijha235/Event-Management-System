import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequestItem, getUserRequestItems, logout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const UserRequestItem = () => {
  const [itemName, setItemName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getUserRequestItems();
      setRequests(response.data.requestItems || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch request items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError('Item name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('itemName', itemName.trim());
      if (imageFile) formData.append('image', imageFile);

      await createRequestItem(formData);
      setSuccess('Item requested successfully');
      setItemName('');
      setImageFile(null);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
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
    <div className="user-screen-layout">
      <div className="user-screen-panel">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div className="user-cart-top-actions">
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/dashboard')}>Home</button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/vendors')}>View Product</button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/request-item')}>Request Item</button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/orders')}>Product Status</button>
          <button type="button" className="vendor-mini-btn" onClick={handleLogout}>LogOut</button>
        </div>

        <div className="user-center-bar">Request Item</div>

        <form className="checkout-grid-form" onSubmit={handleSubmit} style={{ marginTop: '14px' }}>
          <input
            className="vendor-additem-input"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item Name"
            required
          />
          <input
            className="vendor-additem-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          <div className="checkout-action-wrap">
            <button type="submit" className="user-checkout-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Add Request'}
            </button>
          </div>
        </form>

        <div className="vendor-product-cards" style={{ marginTop: '18px' }}>
          {requests.slice(0, 8).map((request) => (
            <div key={request._id} className="vendor-request-box">
              {request.image ? (
                <img src={request.image} alt={request.itemName} className="vendor-inline-image" />
              ) : null}
              <p>{request.itemName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRequestItem;
