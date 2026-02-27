import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendorProducts, updateProduct, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar, FormInput, Button, Alert } from '../components/common';
import { logout } from '../services/api';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
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

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData(product);
  };

  const handleSaveEdit = async () => {
    try {
      await updateProduct(editingId, {
        name: editData.name,
        price: editData.price,
        image: editData.image,
        description: editData.description,
        status: editData.status,
      });
      setSuccess('Product updated successfully');
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id);
        setSuccess('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed');
      }
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
        title="Product Status / View Product"
        links={[
          { label: 'Home', href: '/vendor/main' },
          { label: 'Add New Item', href: '/vendor/add-new-item' },
          { label: 'Transaction', href: '/vendor/transaction' },
          { label: 'Logout', isButton: true, onClick: handleLogout },
        ]}
      />
      <div className="page container">
        <h1 className="page-title">Your Item (Insert / Delete) & Product Status</h1>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div style={{ marginBottom: '2rem' }}>
          <Button
            label="Add New Product"
            onClick={() => navigate('/vendor/add-product')}
            variant="primary"
          />
        </div>

        <div className="card-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {editingId === product._id ? (
                <div style={{ padding: '1rem' }}>
                  <FormInput
                    label="Name"
                    name="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <FormInput
                    label="Price"
                    name="price"
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                  />
                  <FormInput
                    label="Image URL"
                    name="image"
                    value={editData.image}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  />
                  <FormInput
                    label="Description"
                    name="description"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button label="Save" onClick={handleSaveEdit} variant="success" block />
                    <Button label="Cancel" onClick={() => setEditingId(null)} variant="secondary" block />
                  </div>
                </div>
              ) : (
                <>
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
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      {product.description}
                    </p>
                    <p style={{ color: product.status === 'Available' ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                      {product.status}
                    </p>
                    <div className="product-actions">
                      <Button label="Edit" onClick={() => handleEdit(product)} variant="secondary" />
                      <Button label="Delete" onClick={() => handleDelete(product._id)} variant="danger" />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorProducts;
