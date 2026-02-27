import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, logout } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, logout: logoutAuth } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pinCode: user?.pinCode || '',
    phone: user?.phone || '',
    paymentMethod: 'Cash',
  });

  if (cart.length === 0) {
    return (
      <div className="user-screen-layout">
        <div className="user-screen-panel">
          <Alert type="error" message="Cart is empty. Please add items before checkout." />
          <button type="button" className="user-checkout-btn" onClick={() => navigate('/user/vendors')}>
            Go Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  const ordersByVendor = cart.reduce((accumulator, item) => {
    const vendorKey = item.product.vendor || 'unknown';
    if (!accumulator[vendorKey]) {
      accumulator[vendorKey] = [];
    }
    accumulator[vendorKey].push(item);
    return accumulator;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.phone) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const createdOrders = [];

      for (const [vendorId, items] of Object.entries(ordersByVendor)) {
        const products = items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        }));

        const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const orderResponse = await createOrder({
          vendor: vendorId,
          products,
          totalAmount,
          shippingAddress: formData,
          paymentMethod: formData.paymentMethod,
        });

        if (orderResponse?.data?.order) {
          createdOrders.push(orderResponse.data.order);
        }
      }

      const successData = {
        customer: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
        },
        totalAmount: getTotalPrice(),
        itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        createdOrders,
      };

      clearCart();
      navigate('/user/success', { state: successData });
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
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

        <div className="checkout-summary-bar">
          <span>Item</span>
          <span>Grand Total</span>
          <span>₹{getTotalPrice().toFixed(2)}</span>
        </div>

        <div className="user-center-bar" style={{ maxWidth: '220px', margin: '12px auto 20px' }}>
          Details
        </div>

        <form onSubmit={handleSubmit} className="checkout-grid-form">
          <input className="vendor-additem-input" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input className="vendor-additem-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="Number" required />

          <input className="vendor-additem-input" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required />
          <select className="vendor-additem-input" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>

          <input className="vendor-additem-input" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
          <input className="vendor-additem-input" name="state" value={formData.state} onChange={handleChange} placeholder="State" required />

          <input className="vendor-additem-input" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
          <input className="vendor-additem-input" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Pin Code" required />

          <div className="checkout-action-wrap">
            <button type="submit" className="user-checkout-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Order Now'}
            </button>
            <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/cart')}>
              Back to Cart
            </button>
            <button type="button" className="vendor-mini-btn" onClick={handleLogout}>
              LogOut
            </button>
          </div>

          <div className="checkout-items-preview">
            {cart.map((item) => (
              <div key={item.product._id} className="checkout-item-row">
                <span>{item.product.name} x {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
