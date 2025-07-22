// Import required modules
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Import group controller
const {
  getUserGroups,
  createGroup,
  addMember
} = require('../controllers/groupController');

// All routes require authentication
router.use(authMiddleware);

/**
 * Group Routes
 * 
 * GET /api/groups - Get all groups for authenticated user
 * POST /api/groups - Create a new group
 * POST /api/groups/:groupId/members - Add member to group
 */

// Get all groups for authenticated user
router.get('/', getUserGroups);

// Create a new group
router.post('/', createGroup);

// Add member to group
router.post('/:groupId/members', addMember);

module.exports = router;