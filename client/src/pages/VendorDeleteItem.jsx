import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendorProducts, deleteProduct, logout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const VendorDeleteItem = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getVendorProducts();
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setSuccess('Item deleted successfully');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
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
    <div className="vendor-subpage-layout">
      <div className="vendor-subpage-panel">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div className="vendor-subpage-top-row">
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/main')}>
            Home
          </button>
          <div className="vendor-subpage-title">Delete Item</div>
          <button type="button" className="vendor-action-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        <div className="vendor-product-cards">
          {products.map((product) => (
            <div key={product._id} className="vendor-product-box">
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button type="button" className="vendor-mini-btn" onClick={() => handleDelete(product._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDeleteItem;
