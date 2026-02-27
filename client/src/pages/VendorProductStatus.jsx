import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendorProductStatus, updateProduct, deleteProduct, logout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common';

const VendorProductStatus = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { logout: logoutAuth } = useAuth();

  useEffect(() => {
    fetchProductStatus();
  }, []);

  const fetchProductStatus = async () => {
    try {
      const response = await getVendorProductStatus();
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product status');
    }
  };

  const handleToggleStatus = async (product) => {
    const nextStatus = product.status === 'Available' ? 'Out of Stock' : 'Available';
    try {
      await updateProduct(product._id, {
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        status: nextStatus,
      });
      setSuccess('Status updated successfully');
      fetchProductStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setSuccess('Product deleted successfully');
      fetchProductStatus();
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

        <div className="vendor-center-header">Product Status</div>

        <div className="vendor-subpage-top-row" style={{ marginTop: '20px' }}>
          <button type="button" className="vendor-action-btn" onClick={() => navigate('/vendor/main')}>
            Home
          </button>
          <div></div>
          <button type="button" className="vendor-action-btn" onClick={handleLogout}>
            LogOut
          </button>
        </div>

        <div className="vendor-status-grid">
          <div className="vendor-status-label">Name</div>
          <div className="vendor-status-label">E-Mail</div>
          <div className="vendor-status-label">Address</div>
          <div className="vendor-status-label">Status</div>
          <div className="vendor-status-label">Update</div>
          <div className="vendor-status-label">Delete</div>

          {products.map((product) => (
            <React.Fragment key={product._id}>
              <div className="vendor-status-cell">{product.name}</div>
              <div className="vendor-status-cell">{product.vendor?.email || '-'}</div>
              <div className="vendor-status-cell">{product.vendor?.address || '-'}</div>
              <div className="vendor-status-cell">{product.status}</div>
              <button type="button" className="vendor-status-cell-btn" onClick={() => handleToggleStatus(product)}>
                Update
              </button>
              <button type="button" className="vendor-status-cell-btn" onClick={() => handleDelete(product._id)}>
                Delete
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorProductStatus;
