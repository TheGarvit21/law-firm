const express = require('express');
const router = express.Router();
const {
    getRequests,
    approveRequest,
    rejectRequest
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/requests', getRequests);
router.post('/approve-request/:id', approveRequest);
router.delete('/reject-request/:id', rejectRequest);

module.exports = router;
