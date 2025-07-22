// Import mongoose for MongoDB operations
const mongoose = require('mongoose');

/**
 * Simple User Schema Definition
 * 
 * Fields:
 * - username: User's full name (required, trimmed)
 * - email: User's email address (required, unique, lowercase, trimmed)
 * - password: User's hashed password (required)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'], // Custom error message
    trim: true, // Remove whitespace from beginning and end
    minlength: [2, 'Username must be at least 2 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'], // Custom error message
    unique: true, // Ensure email is unique across all users
    lowercase: true, // Convert to lowercase before saving
    trim: true, // Remove whitespace
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'], // Custom error message
    minlength: [6, 'Password must be at least 6 characters long']
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the User model
module.exports = mongoose.model('User', userSchema);