const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    completeProfile,
    getProfile,
    updateProfile
} = require('../controllers/companyController');

router.use(auth);

router.post('/complete-profile', completeProfile);

router.get('/', getProfile);

router.put('/', updateProfile);

module.exports = router;