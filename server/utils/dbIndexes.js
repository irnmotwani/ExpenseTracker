const User = require('../models/User');
const TripGroup = require('../models/TripGroup');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');

/**
 * Create database indexes for better performance
 */
async function createIndexes() {
  try {
    console.log('🔍 Creating database indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 });
    
    // TripGroup indexes
    await TripGroup.collection.createIndex({ created_by: 1 });
    await TripGroup.collection.createIndex({ 'members.user': 1 });
    await TripGroup.collection.createIndex({ createdAt: -1 });
    
    // Expense indexes
    await Expense.collection.createIndex({ group_id: 1 });
    await Expense.collection.createIndex({ paid_by: 1 });
    await Expense.collection.createIndex({ date: -1 });
    await Expense.collection.createIndex({ group_id: 1, date: -1 });
    
    // Settlement indexes
    await Settlement.collection.createIndex({ group_id: 1 });
    await Settlement.collection.createIndex({ from_user_id: 1 });
    await Settlement.collection.createIndex({ to_user_id: 1 });
    await Settlement.collection.createIndex({ date: -1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

module.exports = { createIndexes };