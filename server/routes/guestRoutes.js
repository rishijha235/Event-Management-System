const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

router.get('/guests', auth, roleAuth(['user']), guestController.getGuests);
router.post('/guests', auth, roleAuth(['user']), guestController.addGuest);
router.put('/guests/:id', auth, roleAuth(['user']), guestController.updateGuest);
router.delete('/guests/:id', auth, roleAuth(['user']), guestController.deleteGuest);

module.exports = router;
