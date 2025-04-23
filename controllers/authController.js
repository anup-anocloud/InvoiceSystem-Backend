const User = require('../models/User');
const Company = require('../models/Company');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');

// Register a new company user (step 1)
const register = async (req, res, next) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate input
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, password and confirmation are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already in use'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role: 'company'
        });

        // Create empty company profile
        const company = await Company.create({
            user: user._id,
            status: 'incomplete'
        });

        // Update user with company reference
        user.company = company._id;
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            userId: user._id,
            companyId: company._id,
            profileComplete: false,
            message: 'Registration successful. Please complete your company profile.'
        });
    } catch (err) {
        console.error('Registration error:', err);

        let message = 'Registration failed';
        if (err.name === 'ValidationError') {
            message = 'Validation error: ' + Object.values(err.errors).map(val => val.message).join(', ');
        } else if (err.code === 11000) {
            message = 'Email already in use';
        }

        res.status(500).json({
            success: false,
            message,
            error: err.message
        });
    }
}

// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email })
            .select('+password') // Explicitly get password
            .populate('company');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);
        const profileComplete = user.company?.status === 'complete';

        return res.status(200).json({
            success: true,
            token,
            userId: user._id,
            companyId: user.company?._id,
            profileComplete,
            message: profileComplete
                ? 'Login successful'
                : 'Please complete your company profile'
        });
    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: err.message
        });
    }
};

module.exports = {
    register,
    login
};