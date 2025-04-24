const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    customer: {
        companyName: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        },
        gstNumber: String,
        phoneNumber: String,
        contactPerson: String,
        domainName: String
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        priceAtTime: {
            type: Number,
            // required: true
        }
    }],
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    subtotal: {
        type: Number,
    },
    gstRate: {
        type: Number,
        default: 18
    },
    gstAmount: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue'],
        default: 'draft'
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);