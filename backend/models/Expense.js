const mongoose = require('mongoose');

const expenseSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    categoryId:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
        min:0.01,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    date:{
        type:Date,
        required:true,
        // default:Date.now,
    }
},{
    timestamps:true,
});

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, categoryId: 1, date: -1 });

const Expense=mongoose.model('Expense',expenseSchema);
module.exports=Expense;