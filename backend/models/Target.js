const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  estimatedCost: {
    type: Number,
    required: true,
    min: 0
  },
  targetMonth: { // YYYY-MM format, e.g., "2023-12"
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'achieved', 'shortfall', 'missed'],
    default: 'pending'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for efficient querying by user and target month
targetSchema.index({ userId: 1, targetMonth: 1 });

const Target = mongoose.model('Target', targetSchema);
module.exports = Target;