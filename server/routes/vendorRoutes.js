const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Public routes
router.post('/vendor/login', vendorController.vendorLogin);
router.get('/vendors', vendorController.getAllVendors);
router.get('/vendors/category/:category', vendorController.getVendorsByCategory);
router.get('/vendors/:id', vendorController.getVendorById);

// Vendor routes
router.get('/vendor/profile', auth, roleAuth(['vendor']), vendorController.getVendorProfile);
router.get('/vendor/dashboard', auth, roleAuth(['vendor']), vendorController.getVendorDashboard);

// Admin routes
router.post('/vendors', auth, roleAuth(['admin']), vendorController.addVendor);
router.put('/vendors/:id', auth, roleAuth(['admin']), vendorController.updateVendor);
router.delete('/vendors/:id', auth, roleAuth(['admin']), vendorController.deleteVendor);

module.exports = router;
