const express = require('express');
const router = express.Router();
const {
    registerRequest,
    loginUser,
    logoutUser,
    getUserProfile,
    changePassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register-request', registerRequest);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
