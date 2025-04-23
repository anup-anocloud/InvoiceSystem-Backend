const Item = require('../models/Item');
const mongoose = require('mongoose');

// Create Item
const createItem = async (req, res) => {
    try {
        const { description, quantity, unitPrice } = req.body;
        const companyId = req.user.company; // Changed from req.company to req.user.company

        // Validate input
        if (!description || !quantity || !unitPrice) {
            return res.status(400).json({
                success: false,
                message: 'Please provide description, quantity and unitPrice'
            });
        }

        const item = await Item.create({
            description,
            quantity,
            unitPrice,
            company: companyId
        });

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create item',
            error: error.message
        });
    }
};

// Get All Active Items for a Company
const getItems = async (req, res) => {
    try {
        const companyId = req.user.company; // Changed from req.company to req.user.company
        const items = await Item.find({
            company: companyId,
            isActive: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch items',
            error: error.message
        });
    }
};

// Update Item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.company; // Changed from req.company to req.user.company
        const updates = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID'
            });
        }

        const item = await Item.findOneAndUpdate(
            { _id: id, company: companyId },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found or not owned by your company'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update item',
            error: error.message
        });
    }
};

// Delete Item (Soft Delete)
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.company; // Changed from req.company to req.user.company

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID'
            });
        }

        const item = await Item.findOneAndUpdate(
            { _id: id, company: companyId },
            { isActive: false },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found or not owned by your company'
            });
        }

        res.json({
            success: true,
            data: null,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete item',
            error: error.message
        });
    }
};

module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem
};