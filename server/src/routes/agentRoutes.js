const express = require('express');
const router = express.Router();
const { getAgents, updateAgent } = require('../controllers/agentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getAgents);
router.put('/:id', protect, updateAgent);

module.exports = router;
