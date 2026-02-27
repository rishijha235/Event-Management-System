import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendorProducts, logout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const VendorViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout: logoutAuth, user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getVendorProducts();
        setProducts(response.data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      }
    };

    fetchProducts();
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
          <button type="button" className="maintain-user-btn" onClick={() => navigate('/vendor/main')}>
            Home
          </button>
          <div className="vendor-center-header" style={{ margin: 0, maxWidth: '380px' }}>
            {user?.name || 'Vendor Name'}
          </div>
          <button type="button" className="maintain-user-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        <div className="vendor-center-header" style={{ margin: '16px 0 24px 0', maxWidth: '420px' }}>
          Products
        </div>

        <div className="vendor-product-cards">
          {products.map((product, index) => (
            <div key={product._id} className="vendor-product-box">
              <h3>{`Product ${index + 1}`}</h3>
              {product.image ? (
                <img src={product.image} alt={product.name} className="vendor-inline-image" />
              ) : (
                <p>Image</p>
              )}
              <p>₹{product.price}</p>
              <button type="button" className="vendor-mini-btn">
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorViewProduct;
