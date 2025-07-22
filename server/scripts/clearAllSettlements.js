const mongoose = require('mongoose');
const Settlement = require('../models/Settlement');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expensetracker');

async function clearAllSettlements() {
  try {
    console.log('🧹 Clearing ALL settlements from database...');
    
    // Delete ALL settlements
    const result = await Settlement.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} settlements from database`);
    
    console.log('✨ Database completely cleaned! Now balances will be calculated fresh from expenses only.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearAllSettlements();