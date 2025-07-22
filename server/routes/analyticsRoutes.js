const express = require('express');
const router = express.Router();
const { getGroupAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get analytics for a specific group
router.get('/group/:groupId', authMiddleware, getGroupAnalytics);

module.exports = router;