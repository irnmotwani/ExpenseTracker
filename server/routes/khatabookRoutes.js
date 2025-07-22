const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Import khatabook controller (will be created next)
const {
  getGroupTransactionHistory
} = require('../controllers/khatabookController');

// All routes require authentication
router.use(authMiddleware);

// GET /api/khatabook/group/:groupId - Get complete transaction history for a group
router.get('/group/:groupId', getGroupTransactionHistory);

module.exports = router;