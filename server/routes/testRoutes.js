const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TripGroup = require('../models/TripGroup');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');

// Test endpoint to check if server is running
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running!', 
    timestamp: new Date().toISOString() 
  });
});

// Test expense creation without auth
router.post('/test-expense', async (req, res) => {
  try {
    // Test endpoint working
    res.json({ 
      message: 'Test expense endpoint working',
      receivedData: req.body,
      timestamp: new Date().toISOString(),
      serverInfo: {
        port: process.env.PORT || 3001,
        environment: process.env.NODE_ENV || 'development',
        mongoConnection: process.env.MONGO_URI ? 'Using environment variable' : 'Using local MongoDB'
      }
    });
  } catch (error) {
    console.error('Test expense error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a simple GET test endpoint too
router.get('/test-expense', (req, res) => {
  res.json({ 
    message: 'GET test expense endpoint working',
    timestamp: new Date().toISOString() 
  });
});

// Get all users (for testing)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all groups (for testing)
router.get('/groups', async (req, res) => {
  try {
    const groups = await TripGroup.find()
      .populate('created_by', 'username email')
      .populate('members.user', 'username email');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database stats
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const groupCount = await TripGroup.countDocuments();
    const expenseCount = await Expense.countDocuments();
    const settlementCount = await Settlement.countDocuments();
    
    res.json({
      users: userCount,
      groups: groupCount,
      expenses: expenseCount,
      settlements: settlementCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all settlements (for testing)
router.get('/settlements', async (req, res) => {
  try {
    const settlements = await Settlement.find()
      .populate('from_user_id', 'username email')
      .populate('to_user_id', 'username email')
      .populate('created_by', 'username email')
      .populate('group_id', 'name')
      .sort({ date: -1 });
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test settlement endpoints without auth
router.get('/test-settlement', (req, res) => {
  res.json({ 
    message: 'Settlement endpoints are working!',
    availableEndpoints: [
      'GET /api/settlements/group/:groupId',
      'POST /api/settlements',
      'GET /api/settlements/balances/:groupId',
      'GET /api/settlements/suggestions/:groupId'
    ],
    timestamp: new Date().toISOString() 
  });
});

// Test current user endpoint with auth
router.get('/current-user', require('../middlewares/authMiddleware'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      message: 'Current user info',
      user: user,
      userId: req.user.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all expenses (for testing)
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paid_by', 'username email')
      .populate('group_id', 'name')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;