const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/company', require('./companyRoutes'));
router.use('/invoices', require('./invoiceRoutes'));
router.use('/items', require('./itemRoutes'));

module.exports = router;