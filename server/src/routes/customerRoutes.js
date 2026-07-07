const express = require('express');
const router = express.Router();
const { getCustomers, updateCustomer } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getCustomers);
router.put('/:id', protect, updateCustomer);

module.exports = router;
