const express = require('express');
const router = express.Router();
const requestItemController = require('../controllers/requestItemController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const requestUpload = require('../middleware/requestUpload');

router.post('/request-items', auth, roleAuth(['user']), requestUpload.single('image'), requestItemController.createRequestItem);
router.get('/user/request-items', auth, roleAuth(['user']), requestItemController.getUserRequestItems);
router.get('/request-items', auth, roleAuth(['vendor', 'admin']), requestItemController.getAllRequestItems);

module.exports = router;
