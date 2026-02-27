import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const successData = location.state;

  const customer = successData?.customer || {
    name: user?.name || '-',
    email: user?.email || '-',
    address: '-',
    city: '-',
    state: '-',
    pinCode: '-',
    phone: '-',
    paymentMethod: '-',
  };

  const totalAmount = successData?.totalAmount || 0;

  const handleContinueShopping = async () => {
    navigate('/user/vendors');
  };

  return (
    <div className="user-screen-layout">
      <div className="user-screen-panel" style={{ maxWidth: '980px' }}>
        <div className="success-popup-title">PopUp</div>
        <div className="success-thankyou">THANK YOU</div>

        <div className="user-center-bar" style={{ maxWidth: '360px', margin: '0 auto 18px' }}>
          Total Amount  ₹{Number(totalAmount).toFixed(2)}
        </div>

        <div className="checkout-grid-form">
          <div className="vendor-additem-input success-readonly">{customer.name || 'Name'}</div>
          <div className="vendor-additem-input success-readonly">{customer.phone || 'Number'}</div>
          <div className="vendor-additem-input success-readonly">{customer.email || 'E-mail'}</div>
          <div className="vendor-additem-input success-readonly">{customer.paymentMethod || 'Payment Method'}</div>
          <div className="vendor-additem-input success-readonly">{customer.address || 'Address'}</div>
          <div className="vendor-additem-input success-readonly">{customer.state || 'State'}</div>
          <div className="vendor-additem-input success-readonly">{customer.city || 'City'}</div>
          <div className="vendor-additem-input success-readonly">{customer.pinCode || 'PinCode'}</div>
        </div>

        <button type="button" className="user-checkout-btn" onClick={handleContinueShopping}>
          Continue Shopping
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/orders')}>View Orders</button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/dashboard')}>Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Success;
