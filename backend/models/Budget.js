const mongoose = require('mongoose');

const budgetCategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: 'folder' }, // Default icon if not provided
    allocated: { type: Number, required: true, default: 0 }
}, { _id: false });

const budgetSchema=mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: { // YYYY-MM format
    type: String,
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true,
    min: 0
  },
  categories: [budgetCategorySchema],
  monthlySavingsGoal: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true 
});
//one user can have only one budget for that month.
budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;