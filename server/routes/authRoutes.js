// Import required modules
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Simple Authentication Routes
 * 
 * /api/auth/register - POST - User registration
 * /api/auth/login - POST - User login
 */

// User registration route
// POST /api/auth/register
// Body: { username, email, password }
// Returns: { token, user }
router.post('/register', authController.register);

// User login route  
// POST /api/auth/login
// Body: { email, password }
// Returns: { token, user }
router.post('/login', authController.login);

module.exports = router;