// Import mongoose for MongoDB operations
const mongoose = require('mongoose');

/**
 * Settlement Schema Definition
 * 
 * Represents a payment made between group members to settle debts.
 * For example: John pays $50 to Alice to settle his debt from shared expenses.
 */
const settlementSchema = new mongoose.Schema({
  // Who made the payment
  from_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'From user is required']
  },
  
  // Who received the payment
  to_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'To user is required']
  },
  
  // Which group this settlement belongs to
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TripGroup',
    required: [true, 'Group is required']
  },
  
  // Settlement amount
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  
  // When the settlement was made
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  // Optional description
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  
  // Who recorded this settlement
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Indexes for better query performance
settlementSchema.index({ group_id: 1, date: -1 }); // For group settlements sorted by date
settlementSchema.index({ from_user_id: 1, to_user_id: 1 }); // For user-to-user settlements

// Validation: Prevent self-settlements
settlementSchema.pre('save', function(next) {
  if (this.from_user_id.toString() === this.to_user_id.toString()) {
    next(new Error('Cannot create settlement from user to themselves'));
  } else {
    next();
  }
});

// Export the Settlement model
module.exports = mongoose.model('Settlement', settlementSchema);