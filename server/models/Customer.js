const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  address: {
    type: String,
    required: false,
    trim: true
  }
}, { 
  timestamps: true 
});

// Add indexes for better query performance
CustomerSchema.index({ user_id: 1, name: 1 });
CustomerSchema.index({ user_id: 1, phone: 1 });
CustomerSchema.index({ user_id: 1, createdAt: -1 });

// Virtual field to calculate customer balance (will be populated separately)
CustomerSchema.virtual('balance').get(function() {
  return this._balance || 0;
});

// Ensure virtual fields are serialized
CustomerSchema.set('toJSON', { virtuals: true });
CustomerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Customer', CustomerSchema);