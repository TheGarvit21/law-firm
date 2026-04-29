const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const recentRequests = await Request.find({ status: 'pending' }).limit(5);

    res.json({
        totalUsers,
        pendingRequests,
        recentRequests
    });
};

// @desc    Get user dashboard data
// @route   GET /api/dashboard/user
// @access  Private
const getUserDashboard = async (req, res) => {
    // In a real app, this would fetch the user's cases, appointments, etc.
    res.json({
        message: `Welcome back, ${req.user.name}`,
        userDetails: req.user,
        recentActivity: [
            { id: 1, type: 'Case Update', message: 'Your case #123 has been reviewed.' },
            { id: 2, type: 'Notification', message: 'New message from legal team.' }
        ]
    });
};

module.exports = {
    getAdminStats,
    getUserDashboard
};
