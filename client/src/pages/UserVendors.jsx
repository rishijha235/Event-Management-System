import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendorsByCategory, getProductsByVendorId } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';
import { logout } from '../services/api';

const UserVendors = () => {
  const [selectedCategory, setSelectedCategory] = useState('Catering');
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  const categories = [
    { label: 'Catering', value: 'Catering' },
    { label: 'Florist', value: 'Florist' },
    { label: 'Decoration', value: 'Decoration' },
    { label: 'Lighting', value: 'Lighting' },
  ];

  useEffect(() => {
    fetchVendors();
  }, [selectedCategory]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getVendorsByCategory(selectedCategory);
      setVendors(response.data.vendors);
      setSelectedVendor(null);
      setProducts([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSelect = async (vendor) => {
    setSelectedVendor(vendor);
    try {
      const response = await getProductsByVendorId(vendor._id);
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
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

        <div className="user-top-row">
          <button type="button" className="maintain-user-btn" onClick={() => navigate('/user/dashboard')}>
            Home
          </button>

          <div className="user-center-bar" title="Click to change category">
            <span>Vender</span>
            <select
              className="user-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="maintain-user-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        {loading ? (
          <p className="user-loading-text">Loading vendors...</p>
        ) : (
          <div className="vendor-product-cards">
            {vendors.slice(0, 4).map((vendor, index) => (
              <div key={vendor._id} className="vendor-product-box">
                <p>{vendor.name || `Vender ${index + 1}`}</p>
                <p>Contact Details</p>
                <button
                  type="button"
                  className="vendor-mini-btn"
                  onClick={() => handleVendorSelect(vendor)}
                >
                  Shop Item
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedVendor && (
          <div className="user-products-section">
            <div className="user-products-title">Products - {selectedVendor.name}</div>
            <div className="card-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div style={{ fontSize: '3rem', color: '#ccc' }}>📦</div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">₹{product.price}</div>
                    <button type="button" className="vendor-mini-btn" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVendors;
