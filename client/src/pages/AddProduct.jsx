import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, getVendorProducts, updateProduct, deleteProduct } from '../services/api';
import { Alert } from '../components/common';
import { logout } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user, logout: logoutAuth } = useAuth();

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const validate = () => {
    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      return false;
    }
    if (isNaN(formData.price) || formData.price <= 0) {
      setError('Price must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('price', formData.price);
      if (formData.image) {
        payload.append('image', formData.image);
      }

      const response = await addProduct(payload);
      if (response.data.success) {
        setSuccess('Product added successfully!');
        setFormData({ name: '', price: '', image: null });
        fetchProducts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
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

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusUpdate = async (product) => {
    try {
      const nextStatus = product.status === 'Available' ? 'Out of Stock' : 'Available';
      await updateProduct(product._id, {
        name: product.name,
        price: product.price,
        image: product.image,
        status: nextStatus,
      });
      setSuccess('Product updated successfully');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="vendor-subpage-layout">
      <div className="vendor-subpage-panel">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div className="vendor-additem-topbar">
          <div className="vendor-additem-welcome">Welcome&nbsp; '{user?.name || 'Vendor Name'}'</div>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/vendor/product-status')}>
            Product Status
          </button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/vendor/request-item')}>
            Request Item
          </button>
          <button type="button" className="vendor-mini-btn" onClick={() => navigate('/vendor/view-product')}>
            View Product
          </button>
          <button type="button" className="vendor-mini-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="vendor-additem-content">
          <form className="vendor-additem-form" onSubmit={handleSubmit}>
            <input
              className="vendor-additem-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
            />
            <input
              className="vendor-additem-input"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Product Price"
              required
            />
            <input
              className="vendor-additem-input"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.image && (
              <div style={{ color: '#aeb8ca', fontSize: '1.2rem' }}>
                Selected: {formData.image.name}
              </div>
            )}
            <button type="submit" className="vendor-mini-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add The Product'}
            </button>
          </form>

          <div className="vendor-additem-table">
            <div className="vendor-additem-head">Product Image</div>
            <div className="vendor-additem-head">Product Name</div>
            <div className="vendor-additem-head">Product Price</div>
            <div className="vendor-additem-head">Action</div>

            {products.slice(0, 1).map((product) => (
              <React.Fragment key={product._id}>
                <div className="vendor-additem-cell image-cell">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="vendor-inline-image" />
                  ) : (
                    'Image'
                  )}
                </div>
                <div className="vendor-additem-cell">{product.name}</div>
                <div className="vendor-additem-cell">₹{product.price}</div>
                <div className="vendor-additem-action-col">
                  <button type="button" className="vendor-additem-cell-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                  <button type="button" className="vendor-additem-cell-btn" onClick={() => handleStatusUpdate(product)}>Update</button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
