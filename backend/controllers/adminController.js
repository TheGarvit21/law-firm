const asyncHandler = require('express-async-handler');
const Request = require('../models/Request');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Get all pending requests
// @route   GET /api/admin/requests
// @access  Private/Admin
const getRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({ status: 'pending' });
    res.json(requests);
});

// @desc    Approve a request
// @route   POST /api/admin/approve-request/:id
// @access  Private/Admin
const approveRequest = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: request.email });
    if (userExists) {
        request.status = 'approved';
        await request.save();
        res.status(400);
        throw new Error('User already exists for this email');
    }

    // Generate random password
    const autoPassword = crypto.randomBytes(4).toString('hex');

    // Create User
    const user = await User.create({
        name: request.email.split('@')[0],
        email: request.email,
        password: autoPassword,
        phone: request.phone,
        caseDetails: request.caseDetails,
        role: 'user'
    });

    if (user) {
        // Delete the request from DB as it is now a user
        await Request.findByIdAndDelete(request._id);

        // Send email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Law Firm Access Approved',
                message: `Your request has been approved. \n\nYour login credentials are:\nEmail: ${user.email}\nPassword: ${autoPassword}\n\nPlease change your password after your first login.`
            });
            res.status(200).json({ message: 'Request approved and email sent' });
        } catch (error) {
            console.error('Email error:', error);
            res.status(200).json({ 
                message: 'User created successfully, but welcome email could not be sent. Please provide password manually.',
                credentials: { email: user.email, password: autoPassword }
            });
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Reject a request (Delete from DB)
// @route   DELETE /api/admin/reject-request/:id
// @access  Private/Admin
const rejectRequest = asyncHandler(async (req, res) => {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (request) {
        res.json({ message: 'Request declined and removed from database' });
    } else {
        res.status(404);
        throw new Error('Request not found');
    }
});


module.exports = {
    getRequests,
    approveRequest,
    rejectRequest
};

