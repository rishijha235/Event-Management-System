const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

router.post('/admin/signup', authController.adminSignup);
router.post('/admin/login', authController.adminLogin);
router.get('/admin/profile', auth, roleAuth(['admin']), authController.getAdminProfile);
router.post('/logout', authController.logout);

module.exports = router;
