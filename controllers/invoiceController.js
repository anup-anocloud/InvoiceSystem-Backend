const Invoice = require('../models/Invoice');
const Item = require('../models/Item');
const generateInvoiceNumber = require('../utils/generateInvoiceNumber');
const calculateInvoice = require('../utils/calculateInvoice');

const createInvoice = async (req, res, next) => {
    try {
        const { invoiceType, customer, items, discount = 0, gstRate = 18, dueDate } = req.body;
        const companyId = req.user.company;

        const itemIds = items.map(i => i.itemId);

        const validItems = await Item.find({
            _id: { $in: itemIds },
            company: companyId
        });


        if (validItems.length !== items.length) {
            return res.status(400).json({
                message: 'One or more invalid items provided.',
                expectedItems: itemIds,
                foundItems: validItems.map(i => i._id.toString())
            });
        }

        const invoiceItems = items.map(i => {
            const matchedItem = validItems.find(item => item._id.toString() === i.itemId);
            return {
                item: matchedItem._id,
                quantity: matchedItem.quantity,
                priceAtTime: matchedItem.unitPrice
            };
        });

        const {
            subtotal,
            discountAmount,
            amountAfterDiscount,
            gstAmount,
            totalAmount
        } = calculateInvoice(invoiceItems, discount, gstRate);

        const invoiceNumber = await generateInvoiceNumber(invoiceType, companyId, Invoice);

        const newInvoice = await Invoice.create({
            invoiceNumber,
            company: companyId,
            customer,
            items: invoiceItems,
            discount,
            subtotal,
            gstRate,
            gstAmount,
            totalAmount,
            dueDate: new Date(dueDate)
        });

        res.status(201).json({ success: true, data: newInvoice });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getInvoices = async (req, res, next) => {
    try {
        const companyId = req.user.company;

        const invoices = await Invoice.find({ company: companyId })
            .populate('items.item', 'description quantity unitPrice')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        next(error);
    }
};

const getInvoiceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = req.user.company;

        const invoice = await Invoice.findOne({ _id: id, company: companyId })
            .populate('items.item', 'description unitPrice unitType');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }

        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById
};
