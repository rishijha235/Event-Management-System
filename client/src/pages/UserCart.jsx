import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';

const UserCart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
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
    <div className="user-screen-layout">
      <div className="user-screen-panel">
        <div className="user-cart-top-actions">
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/dashboard')}>Home</button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/vendors')}>View Product</button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/request-item')}>Request Item</button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/user/orders')}>Product Status</button>
          <button type="button" className="vendor-mini-btn" onClick={handleLogout}>LogOut</button>
        </div>

        <div className="user-center-bar">Shopping Cart</div>

        <div className="user-cart-grid">
          <div className="user-cart-head">Image</div>
          <div className="user-cart-head">Name</div>
          <div className="user-cart-head">Price</div>
          <div className="user-cart-head">Quantity</div>
          <div className="user-cart-head">Total Price</div>
          <div className="user-cart-head">Action</div>

          {cart.map((item) => (
            <React.Fragment key={item.product._id}>
              <div className="user-cart-cell">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="vendor-inline-image" />
                ) : (
                  'Image'
                )}
              </div>
              <div className="user-cart-cell">{item.product.name}</div>
              <div className="user-cart-cell">₹{item.product.price}</div>
              <div className="user-cart-cell">
                <select
                  className="user-qty-select"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value, 10))}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
                    <option key={qty} value={qty}>{qty}</option>
                  ))}
                </select>
              </div>
              <div className="user-cart-cell">₹{(item.product.price * item.quantity).toFixed(2)}</div>
              <div className="user-cart-cell">
                <button type="button" className="vendor-mini-btn" onClick={() => removeFromCart(item.product._id)}>
                  Remove
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="user-grand-total-row">
          <span>Grand Total</span>
          <span>₹{getTotalPrice().toFixed(2)}</span>
          <button type="button" className="vendor-mini-btn" onClick={clearCart}>Delete All</button>
        </div>

        <button type="button" className="user-checkout-btn" onClick={() => navigate('/user/checkout')}>
          Proceed to CheckOut
        </button>
      </div>
    </div>
  );
};

export default UserCart;
