import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert, Loading } from '../components/common';
import { logout } from '../services/api';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getUserOrders();
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
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
      <div className="user-top-label">User Order status</div>
      <div className="user-screen-panel">
        <Alert type="error" message={error} />

        <div className="user-top-row">
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/user/dashboard')}>
            Home
          </button>
          <div className="user-center-bar">User Order Status</div>
          <button type="button" className="vendor-action-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="vendor-empty-state">No orders yet.</div>
        ) : (
          <div className="user-order-grid">
            <div className="user-order-head">Name</div>
            <div className="user-order-head">E-mail</div>
            <div className="user-order-head">Address</div>
            <div className="user-order-head">Status</div>

            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <div className="user-order-cell">{order.shippingAddress?.name || '-'}</div>
                <div className="user-order-cell">{order.shippingAddress?.email || '-'}</div>
                <div className="user-order-cell">
                  {[
                    order.shippingAddress?.address,
                    order.shippingAddress?.city,
                    order.shippingAddress?.state,
                    order.shippingAddress?.pinCode,
                  ].filter(Boolean).join(', ') || '-'}
                </div>
                <div className="user-order-cell">{order.status}</div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
