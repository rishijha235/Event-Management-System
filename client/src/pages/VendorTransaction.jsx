import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendorOrders, logout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const VendorTransaction = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getVendorOrders();
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transactions');
      }
    };

    fetchOrders();
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
    <div className="vendor-subpage-layout">
      <div className="vendor-subpage-panel">
        <Alert type="error" message={error} />

        <div className="vendor-subpage-top-row">
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/main')}>
            Home
          </button>
          <div className="vendor-subpage-title">Transaction</div>
          <button type="button" className="vendor-action-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="vendor-empty-state">No transactions yet.</div>
        ) : (
          <div className="vendor-transaction-list">
            {orders.map((order) => (
              <div key={order._id} className="vendor-transaction-card">
                <div className="vendor-transaction-head">
                  <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                <div className="vendor-transaction-grid">
                  <div><strong>User:</strong> {order.user?.name || '-'}</div>
                  <div><strong>Email:</strong> {order.user?.email || '-'}</div>
                  <div><strong>Status:</strong> {order.status}</div>
                  <div><strong>Payment:</strong> {order.paymentMethod}</div>
                  <div><strong>Total:</strong> ₹{order.totalAmount}</div>
                  <div><strong>Address:</strong> {[
                    order.shippingAddress?.address,
                    order.shippingAddress?.city,
                    order.shippingAddress?.state,
                    order.shippingAddress?.pinCode,
                  ].filter(Boolean).join(', ') || '-'}</div>
                </div>

                <div className="vendor-transaction-items">
                  {(order.products || []).map((line, idx) => (
                    <div key={`${order._id}-${idx}`} className="vendor-transaction-item-row">
                      <span>{line.product?.name || 'Item'}</span>
                      <span>Qty: {line.quantity}</span>
                      <span>₹{line.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorTransaction;
