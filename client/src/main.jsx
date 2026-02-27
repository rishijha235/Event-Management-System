import './styles/index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { getDashboardPathByRole } from './utils/roleRedirect';

// Pages
import Index from './pages/Index';
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import MaintainUsers from './pages/MaintainUsers';
import UserManagement from './pages/UserManagement';
import MaintainVendors from './pages/MaintainVendors';
import Membership from './pages/Membership';
import VendorManagement from './pages/VendorManagement';
import VendorMembership from './pages/VendorMembership';
import VendorProducts from './pages/VendorProducts';
import AddProduct from './pages/AddProduct';
import VendorYourItem from './pages/VendorYourItem';
import VendorDeleteItem from './pages/VendorDeleteItem';
import VendorProductStatus from './pages/VendorProductStatus';
import VendorRequestItem from './pages/VendorRequestItem';
import VendorViewProduct from './pages/VendorViewProduct';
import VendorTransaction from './pages/VendorTransaction';
import UserVendors from './pages/UserVendors';
import UserCart from './pages/UserCart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import OrderStatus from './pages/OrderStatus';
import UserRequestItem from './pages/UserRequestItem';
import VendorOrders from './pages/VendorOrders';
import GuestList from './pages/GuestList';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/index" replace />;
  }

  if (!user?.role) {
    return <Navigate to="/index" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated && user?.role) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  return children;
};

const RootRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated && user?.role) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  return <Navigate to="/index" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/index" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/admin/signup" element={<PublicRoute><AdminSignup /></PublicRoute>} />
      <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route path="/user/signup" element={<PublicRoute><UserSignup /></PublicRoute>} />
      <Route path="/user/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
      <Route path="/vendor/login" element={<PublicRoute><VendorLogin /></PublicRoute>} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <MaintainUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vendors"
        element={
          <ProtectedRoute requiredRole="admin">
            <MaintainVendors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vendor-management"
        element={
          <ProtectedRoute requiredRole="admin">
            <VendorManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vendor-membership"
        element={
          <ProtectedRoute requiredRole="admin">
            <VendorMembership />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/membership"
        element={
          <ProtectedRoute requiredRole="admin">
            <Membership />
          </ProtectedRoute>
        }
      />

      {/* Vendor Routes */}
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/main"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/products"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorViewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/your-item"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorYourItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/delete-item"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorDeleteItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/add-product"
        element={
          <ProtectedRoute requiredRole="vendor">
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/add-new-item"
        element={
          <ProtectedRoute requiredRole="vendor">
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/orders"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/transaction"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/request-item"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorRequestItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/product-status"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorProductStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/view-product"
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorViewProduct />
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/vendors"
        element={
          <ProtectedRoute requiredRole="user">
            <UserVendors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/cart"
        element={
          <ProtectedRoute requiredRole="user">
            <UserCart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/checkout"
        element={
          <ProtectedRoute requiredRole="user">
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/success"
        element={
          <ProtectedRoute requiredRole="user">
            <Success />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/orders"
        element={
          <ProtectedRoute requiredRole="user">
            <OrderStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/request-item"
        element={
          <ProtectedRoute requiredRole="user">
            <UserRequestItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/guest-list"
        element={
          <ProtectedRoute requiredRole="user">
            <GuestList />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<RootRoute />} />
      <Route path="*" element={<RootRoute />} />
    </Routes>
  );
}

function Root() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default Root;
