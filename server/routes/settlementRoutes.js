// Import required modules
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Import settlement controller
const {
  getGroupBalances,
  recordSettlement,
  getGroupSettlements,
  deleteSettlement
} = require('../controllers/settlementController');

// All routes require authentication
router.use(authMiddleware);

/**
 * Settlement Routes
 * 
 * GET /api/settlements/balances/:groupId - Get calculated balances for a group
 * POST /api/settlements - Record a new settlement
 * GET /api/settlements/group/:groupId - Get all settlements for a group
 * DELETE /api/settlements/:settlementId - Delete a settlement
 */

// Get calculated balances for a group
router.get('/balances/:groupId', getGroupBalances);

// Record a new settlement
router.post('/', recordSettlement);

// Get all settlements for a group
router.get('/group/:groupId', getGroupSettlements);

// Delete a settlement
router.delete('/:settlementId', deleteSettlement);

module.exports = router;