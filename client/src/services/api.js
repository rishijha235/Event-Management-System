import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete API.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Auth APIs
export const adminSignup = (data) => API.post('/auth/admin/signup', data);
export const adminLogin = (data) => API.post('/auth/admin/login', data);
export const userSignup = (data) => API.post('/auth/user/signup', data);
export const userLogin = (data) => API.post('/auth/user/login', data);
export const vendorLogin = (data) => API.post('/vendor/login', data);
export const logout = () => API.post('/logout');

// User APIs
export const getAdminProfile = () => API.get('/auth/admin/profile');
export const getUserProfile = () => API.get('/auth/user/profile');
export const updateUserProfile = (data) => API.put('/auth/user/profile', data);

// Admin User Management APIs
export const getAllUsers = () => API.get('/users');
export const addUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const getUserById = (id) => API.get(`/users/${id}`);

// Guest List APIs
export const getGuests = () => API.get('/guests');
export const addGuest = (data) => API.post('/guests', data);
export const updateGuest = (id, data) => API.put(`/guests/${id}`, data);
export const deleteGuest = (id) => API.delete(`/guests/${id}`);

// Vendor APIs
export const getAllVendors = () => API.get('/vendors');
export const getVendorsByCategory = (category) => API.get(`/vendors/category/${category}`);
export const getVendorById = (id) => API.get(`/vendors/${id}`);
export const getVendorProfile = () => API.get('/vendor/profile');
export const getVendorDashboardData = () => API.get('/vendor/dashboard');
export const addVendor = (data) => API.post('/vendors', data);
export const updateVendor = (id, data) => API.put(`/vendors/${id}`, data);
export const deleteVendor = (id) => API.delete(`/vendors/${id}`);

// Product APIs
export const addProduct = (data) => API.post('/products', data);
export const getVendorProducts = () => API.get('/vendor/products');
export const getVendorProductStatus = () => API.get('/vendor/product-status');
export const getProductsByVendorId = (vendorId) => API.get(`/products/vendor/${vendorId}`);
export const getProductById = (id) => API.get(`/products/${id}`);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Order APIs
export const createOrder = (data) => API.post('/orders', data);
export const getUserOrders = () => API.get('/user/orders');
export const getVendorOrders = () => API.get('/vendor/orders');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders');

// Membership APIs
export const addMembership = (data) => API.post('/memberships', data);
export const updateMembership = (membershipNumber, data) =>
  API.put(`/memberships/${membershipNumber}`, data);
export const getAllMemberships = () => API.get('/memberships');
export const getMembershipDetails = (membershipNumber) =>
  API.get(`/memberships/${membershipNumber}`);
export const extendMembership = (data) => API.put('/memberships/extend', data);
export const cancelMembership = (data) => API.put('/memberships/cancel', data);
export const getVendorMembership = () => API.get('/vendor/membership');
export const addVendorMembership = (data) => API.post('/vendor-memberships', data);
export const updateVendorMembership = (membershipNumber, data) =>
  API.put(`/vendor-memberships/${membershipNumber}`, data);
export const getAllVendorMemberships = () => API.get('/vendor-memberships');

// Request Item APIs
export const createRequestItem = (formData) =>
  API.post('/request-items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getUserRequestItems = () => API.get('/user/request-items');
export const getAllRequestItems = () => API.get('/request-items');

export default API;
