import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendorOrders, updateOrderStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar, FormRadio, Button, Alert } from '../components/common';
import { logout } from '../services/api';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getVendorOrders();
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setSuccess('Order status updated successfully');
      setEditingId(null);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
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
        title="Transaction / User Request"
        links={[
          { label: 'Home', href: '/vendor/main' },
          { label: 'Product Status', href: '/vendor/product-status' },
          { label: 'View Product', href: '/vendor/view-product' },
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />
      <div className="page container">
        <h1 className="page-title">User Request</h1>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6)}</td>
                  <td>{order.user?.name}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    {editingId === order._id ? (
                      <FormRadio
                        name="status"
                        options={[
                          { label: 'Received', value: 'Received' },
                          { label: 'Ready for Shipping', value: 'Ready for Shipping' },
                          { label: 'Out for Delivery', value: 'Out for Delivery' },
                          { label: 'Delivered', value: 'Delivered' },
                        ]}
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      />
                    ) : (
                      order.status
                    )}
                  </td>
                  <td>
                    {editingId === order._id ? (
                      <>
                        <Button
                          label="Save"
                          onClick={() => handleStatusUpdate(order._id, editStatus)}
                          variant="success"
                        />
                        <Button
                          label="Cancel"
                          onClick={() => setEditingId(null)}
                          variant="secondary"
                        />
                      </>
                    ) : (
                      <Button
                        label="Update Status"
                        onClick={() => {
                          setEditingId(order._id);
                          setEditStatus(order.status);
                        }}
                        variant="primary"
                      />
                    )}
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

export default VendorOrders;
