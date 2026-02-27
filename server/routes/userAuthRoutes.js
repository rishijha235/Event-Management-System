const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

router.post('/user/signup', userAuthController.userSignup);
router.post('/user/login', userAuthController.userLogin);
router.get('/user/profile', auth, roleAuth(['user']), userAuthController.getUserProfile);
router.put('/user/profile', auth, roleAuth(['user']), userAuthController.updateUserProfile);

module.exports = router;
