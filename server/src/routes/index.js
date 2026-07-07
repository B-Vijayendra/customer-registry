const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/customers', require('./customerRoutes'));
router.use('/agents', require('./agentRoutes'));
router.use('/complaints', require('./complaintRoutes'));
router.use('/messages', require('./messageRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;
