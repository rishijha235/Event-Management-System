const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

// Vendor routes
router.post('/products', auth, roleAuth(['vendor']), upload.single('image'), productController.addProduct);
router.get('/vendor/products', auth, roleAuth(['vendor']), productController.getVendorProducts);
router.get('/vendor/product-status', auth, roleAuth(['vendor']), productController.getVendorProductStatus);
router.put('/products/:id', auth, roleAuth(['vendor']), upload.single('image'), productController.updateProduct);
router.delete('/products/:id', auth, roleAuth(['vendor']), productController.deleteProduct);

// Public routes
router.get('/products/vendor/:vendorId', productController.getProductsByVendorId);
router.get('/products/:id', productController.getProductById);

module.exports = router;
