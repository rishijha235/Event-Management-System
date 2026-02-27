const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Admin routes
router.get('/users', auth, roleAuth(['admin']), userController.getAllUsers);
router.post('/users', auth, roleAuth(['admin']), userController.addUser);
router.put('/users/:id', auth, roleAuth(['admin']), userController.updateUser);
router.delete('/users/:id', auth, roleAuth(['admin']), userController.deleteUser);
router.get('/users/:id', auth, roleAuth(['admin']), userController.getUserById);

module.exports = router;
