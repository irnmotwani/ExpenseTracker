const mongoose = require('mongoose');

const ExpenseSplitSchema = new mongoose.Schema({
  expense_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount_share: {
    type: Number,
    required: true
  },
  split_type: {
    type: String,
    enum: ['equal', 'exact', 'percentage'],
    default: 'equal'
  }
}, { timestamps: true });

module.exports = mongoose.model('ExpenseSplit', ExpenseSplitSchema);