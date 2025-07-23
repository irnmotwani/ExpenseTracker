const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Use environment variable if available, otherwise use local MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/expenseflow';
    
    // Connect without deprecated options
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected:', mongoURI);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Solutions:');
    console.log('   1. Start MongoDB: net start MongoDB');
    console.log('   2. Install MongoDB Community Server');
    console.log('   3. Check if MongoDB service is running');
    console.log('   4. Set MONGO_URI environment variable for cloud database');
    process.exit(1);
  }
};

module.exports = connectDB; 