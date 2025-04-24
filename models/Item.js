const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: [true, 'Company reference is required']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

// Add index for better query performance
itemSchema.index({ company: 1, isActive: 1 });

module.exports = mongoose.model("Item", itemSchema);