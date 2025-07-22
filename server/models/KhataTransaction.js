const mongoose = require('mongoose');

const KhataTransactionSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['debit', 'credit'],
    lowercase: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Add indexes for better query performance
KhataTransactionSchema.index({ customer_id: 1, date: -1 });
KhataTransactionSchema.index({ user_id: 1, date: -1 });
KhataTransactionSchema.index({ customer_id: 1, createdAt: -1 });

// Static method to calculate customer balance
KhataTransactionSchema.statics.calculateCustomerBalance = async function(customerId) {
  const transactions = await this.find({ customer_id: customerId }).sort({ date: 1 });
  
  let balance = 0;
  transactions.forEach(transaction => {
    if (transaction.type === 'debit') {
      balance += transaction.amount; // Customer owes money
    } else {
      balance -= transaction.amount; // Customer paid money
    }
  });
  
  return Math.round(balance * 100) / 100; // Round to 2 decimal places
};

// Static method to get customer balance with transaction history
KhataTransactionSchema.statics.getCustomerBalanceHistory = async function(customerId) {
  const transactions = await this.find({ customer_id: customerId }).sort({ date: 1 });
  
  let runningBalance = 0;
  const transactionsWithBalance = transactions.map(transaction => {
    if (transaction.type === 'debit') {
      runningBalance += transaction.amount;
    } else {
      runningBalance -= transaction.amount;
    }
    
    return {
      ...transaction.toObject(),
      runningBalance: Math.round(runningBalance * 100) / 100
    };
  });
  
  return {
    transactions: transactionsWithBalance,
    currentBalance: runningBalance
  };
};

module.exports = mongoose.model('KhataTransaction', KhataTransactionSchema);