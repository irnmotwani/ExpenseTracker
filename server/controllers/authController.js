// Import required modules
const User = require('../models/User'); // User model for database operations
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT token generation

/**
 * Simple User Registration Controller
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'test123456789',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username,
        email
      }
    });

    console.log('✅ User registered successfully:', username);
    
  } catch (err) {
    console.error('❌ Registration failed:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Simple User Login Controller
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'test123456789',
      { expiresIn: '7d' }
    );

    // Return success response with token and user data
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

    console.log('✅ User logged in successfully:', user.username);
    
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};