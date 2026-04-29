const User = require('../models/User');
const Request = require('../models/Request');
const generateToken = require('../utils/generateToken');

// @desc    Register access request
// @route   POST /api/auth/register-request
// @access  Public
const registerRequest = async (req, res) => {
    const { email, phone, caseDetails } = req.body;

    const requestExists = await Request.findOne({ email });
    const userExists = await User.findOne({ email });

    if (requestExists || userExists) {
        return res.status(400).json({ message: 'Request already submitted or user already exists' });
    }

    const request = await Request.create({
        email,
        phone,
        caseDetails
    });

    if (request) {
        res.status(201).json({ message: 'Request sent to admin successfully' });
    } else {
        res.status(400).json({ message: 'Invalid request data' });
    }
};

// @desc    Auth user & get token
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check if it's the admin from .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
        
        if (!adminUser) {
            // Auto-create admin if not exists
            adminUser = await User.create({
                name: 'System Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin',
                isFirstLogin: false
            });
        }

        generateToken(res, adminUser._id);
        return res.json({
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            isFirstLogin: false
        });
    }

    // Normal user login
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isFirstLogin: user.isFirstLogin
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};


// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.password = req.body.password;
        user.isFirstLogin = false;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerRequest,
    loginUser,
    logoutUser,
    getUserProfile,
    changePassword
};
