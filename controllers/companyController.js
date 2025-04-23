const Company = require('../models/Company');
const User = require('../models/User');

// Complete company profile (step 2)
const completeProfile = async (req, res, next) => {
    try {
        const {
            companyName,
            phoneNumber,
            gstNumber,
            panNumber,
            directorName,
            address,
            bankDetails,
            website,
            logo
        } = req.body;

        // Validate required fields
        if (!companyName || !phoneNumber || !gstNumber) {
            return res.status(400).json({
                success: false,
                message: 'Company name, phone number and GST number are required'
            });
        }

        // Find company belonging to the logged-in user
        const company = await Company.findOneAndUpdate(
            { user: req.user._id },
            {
                companyName,
                phoneNumber,
                gstNumber,
                panNumber,
                directorName,
                address,
                bankDetails,
                website,
                logo,
                status: 'complete'
            },
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.json({
            success: true,
            data: company,
            message: 'Company profile updated successfully'
        });
    } catch (err) {
        console.error('Profile completion error:', err);

        let message = 'Profile completion failed';
        if (err.name === 'ValidationError') {
            message = 'Validation error: ' + Object.values(err.errors).map(val => val.message).join(', ');
        }

        res.status(500).json({
            success: false,
            message,
            error: err.message
        });
    }
};

// Get company profile
const getProfile = async (req, res, next) => {
    try {
        const company = await Company.findOne({ user: req.user._id });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.json({
            success: true,
            data: company,
            isComplete: company.status === 'complete'
        });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch company profile',
            error: err.message
        });
    }
};

// Update company profile
const updateProfile = async (req, res, next) => {
    try {
        const updates = req.body;

        // Don't allow status to be modified directly
        if (updates.status) {
            delete updates.status;
        }

        const company = await Company.findOneAndUpdate(
            { user: req.user._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.json({
            success: true,
            data: company,
            message: 'Company profile updated successfully'
        });
    } catch (err) {
        console.error('Update profile error:', err);

        let message = 'Profile update failed';
        if (err.name === 'ValidationError') {
            message = 'Validation error: ' + Object.values(err.errors).map(val => val.message).join(', ');
        }

        res.status(500).json({
            success: false,
            message,
            error: err.message
        });
    }
};

module.exports = {
    completeProfile,
    getProfile,
    updateProfile
};