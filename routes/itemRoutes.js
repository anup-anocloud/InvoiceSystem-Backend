const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createItem,
    getItems,
    updateItem,
    deleteItem
} = require('../controllers/itemController');

// Apply auth middleware to all routes
router.use(auth);

router.route('/')
    .post(createItem)
    .get(getItems);

router.route('/:id')
    .put(updateItem)
    .delete(deleteItem);

module.exports = router;