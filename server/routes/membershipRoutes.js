const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Admin routes
router.post('/memberships', auth, roleAuth(['admin']), membershipController.addMembership);
router.put('/memberships/extend', auth, roleAuth(['admin']), membershipController.extendMembership);
router.put('/memberships/cancel', auth, roleAuth(['admin']), membershipController.cancelMembership);
router.put('/memberships/:membershipNumber', auth, roleAuth(['admin']), membershipController.updateMembership);
router.get('/memberships', auth, roleAuth(['admin']), membershipController.getAllMemberships);
router.get('/memberships/:membershipNumber', auth, roleAuth(['admin']), membershipController.getMembershipDetails);

router.post('/vendor-memberships', auth, roleAuth(['admin']), membershipController.addVendorMembership);
router.put('/vendor-memberships/:membershipNumber', auth, roleAuth(['admin']), membershipController.updateVendorMembership);
router.get('/vendor-memberships', auth, roleAuth(['admin']), membershipController.getAllVendorMemberships);

// Vendor routes
router.get('/vendor/membership', auth, roleAuth(['vendor']), membershipController.getVendorMembership);

module.exports = router;
