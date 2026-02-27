const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// User routes
router.post('/orders', auth, roleAuth(['user']), orderController.createOrder);
router.get('/user/orders', auth, roleAuth(['user']), orderController.getUserOrders);

// Vendor routes
router.get('/vendor/orders', auth, roleAuth(['vendor']), orderController.getVendorOrders);
router.put('/orders/:id/status', auth, roleAuth(['vendor']), orderController.updateOrderStatus);

// Admin routes
router.get('/orders', auth, roleAuth(['admin']), orderController.getAllOrders);
router.get('/orders/:id', auth, orderController.getOrderById);

module.exports = router;
