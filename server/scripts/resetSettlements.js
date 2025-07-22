const mongoose = require('mongoose');
const Settlement = require('../models/Settlement');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expensetracker');

async function resetSettlements() {
  try {
    console.log('🧹 Resetting all settlements for Manali group...');
    
    // Delete all settlements for Manali group (6878ff496726b36f74b5b0c7)
    const result = await Settlement.deleteMany({ 
      group_id: '6878ff496726b36f74b5b0c7' 
    });
    
    console.log(`✅ Deleted ${result.deletedCount} settlements from Manali group`);
    
    // Show remaining settlements
    const remaining = await Settlement.find({ 
      group_id: '6878ff496726b36f74b5b0c7' 
    });
    
    console.log(`📋 Remaining settlements in Manali group: ${remaining.length}`);
    
    console.log('✨ Database cleaned! Now balances will be calculated fresh from expenses only.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetSettlements();