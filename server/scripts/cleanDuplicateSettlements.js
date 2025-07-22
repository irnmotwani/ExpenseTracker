const mongoose = require('mongoose');
const Settlement = require('../models/Settlement');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expensetracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function cleanDuplicateSettlements() {
  try {
    console.log('🧹 Cleaning duplicate settlements...');
    
    // Get all settlements for Manali group
    const settlements = await Settlement.find({ 
      group_id: '6878ff496726b36f74b5b0c7' // Manali group ID
    }).sort({ createdAt: 1 });
    
    console.log(`Found ${settlements.length} settlements`);
    
    // Keep only the latest settlement for each unique combination
    const uniqueSettlements = new Map();
    const toDelete = [];
    
    settlements.forEach(settlement => {
      const key = `${settlement.from_user_id}-${settlement.to_user_id}-${settlement.amount}`;
      
      if (uniqueSettlements.has(key)) {
        // Mark older one for deletion
        toDelete.push(uniqueSettlements.get(key)._id);
      }
      
      uniqueSettlements.set(key, settlement);
    });
    
    console.log(`Deleting ${toDelete.length} duplicate settlements...`);
    
    // Delete duplicates
    if (toDelete.length > 0) {
      await Settlement.deleteMany({ _id: { $in: toDelete } });
      console.log('✅ Duplicates deleted successfully!');
    }
    
    // Show remaining settlements
    const remaining = await Settlement.find({ 
      group_id: '6878ff496726b36f74b5b0c7' 
    }).populate('from_user_id', 'username')
      .populate('to_user_id', 'username');
    
    console.log('\n📋 Remaining settlements:');
    remaining.forEach(s => {
      console.log(`${s.from_user_id.username} → ${s.to_user_id.username}: ₹${s.amount}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanDuplicateSettlements();