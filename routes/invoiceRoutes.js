const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createInvoice, getInvoices, getInvoiceById } = require('../controllers/invoiceController');

router.use(auth);

router.route('/:id').get(getInvoiceById);

router.route('/')
    .post(createInvoice)
    .get(getInvoices);


module.exports = router;