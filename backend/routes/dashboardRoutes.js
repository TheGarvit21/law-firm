const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getUserDashboard
} = require('../controllers/dashboardController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/admin', protect, admin, getAdminStats);
router.get('/user', protect, getUserDashboard);

module.exports = router;
