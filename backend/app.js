const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv'); 
dotenv.config();
const Budget = require('./models/Budget');
const Expense = require('./models/Expense');
const Target = require('./models/Target');
const cors = require('cors');

//const dburl="mongodb://localhost:27017/FinanceFlow";
const dburl=process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

main().then(()=>{
  console.log("connected to DB");
}).catch((err)=>{
  console.log(`Error connecting to DB:${err}`);
});

async function main(){
  await mongoose.connect(dburl);
}

const app=express();
const port=process.env.PORT||5000;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
  res.send("App is running ");
});

//Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const tokenValue = token.split(' ')[1];
    const decoded = jwt.verify(tokenValue, JWT_SECRET);
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

app.post('/signup',async(req,res)=>{
  try{
    const {username,email,password}=req.body;

    if(!username||!email||!password){
      return res.status(400).json({message:"please enter all the fields"});
    }

    let user=await User.findOne({email});
    if(user){
      return res.status(400).json({message:"User alredy exists"});
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser=new User({
      username,
      email,
      password:hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  }catch(err){
    console.log("signup error:",err.message);
    res.status(500).json({message:"Error during signup"});
  }
});

app.post('/login',async(req,res)=>{
  try{
    const {email,password}=req.body;

    if(!email||!password){
      return res.status(400).json({message:"Please enter both email and password"});
    }

    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"User not found.Please create an account"});
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid Credentials.Please check your password"});
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '2h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ message: "Logged in successfully!", token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );

  } catch (err) {
    console.log("Login error:", err.message);
    res.status(500).json({ message: "Error during login" });
  }
});

//budget route
app.post('/budget', authMiddleware, async (req, res) => {
  try {
    const { monthlyIncome, categories, monthlySavingsGoal } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated token

    // Get current month in YYYY-MM format
    const month = new Date().toISOString().slice(0, 7);

    // Prepare categories for the schema
    const budgetCategories = categories.map(cat => ({
      name: cat.name,
      icon: cat.icon, // Ensure 'icon' is passed from frontend if you want to store it
      allocated: Number(cat.allocated || 0)
    }));

    // Find if a budget already exists for the user and current month
    let budget = await Budget.findOne({ userId, month });

    if (budget) {
      // Update existing budget
      budget.monthlyIncome = monthlyIncome;
      budget.categories = budgetCategories;
      budget.monthlySavingsGoal = monthlySavingsGoal;
      await budget.save();
      res.status(200).json({ message: 'Budget updated successfully!', budget });
    } else {
      // Create new budget
      budget = new Budget({
        userId,
        month,
        monthlyIncome,
        categories: budgetCategories,
        monthlySavingsGoal
      });
      await budget.save();
      res.status(201).json({ message: 'Budget created successfully!', budget });
    }
  } catch (error) {
    console.error('Error setting budget:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Budget for this month already exists for this user.' });
    }
    res.status(500).json({ message: 'Server error while setting budget.', error: error.message });
  }
});

app.get('/budget', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;

    if (!month) {
      // If month is not provided, fetch current month's budget
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budget = await Budget.findOne({ userId, month: currentMonth });

      if (!budget) {
        return res.status(404).json({ message: 'Budget not found for the current month.' });
      }
      return res.status(200).json({ budget });
    }

    const budget = await Budget.findOne({ userId, month });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found for this month.' });
    }
    res.status(200).json({ budget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ message: 'Server error while fetching budget.', error: error.message });
  }
});


//addexpense route
app.post('/addexpense',authMiddleware,async(req,res)=>{
  try{
    const {categoryId,amount,description,date}=req.body;
    const userId=req.user.id;

    if(!categoryId||!amount||Number(amount)<=0||!description||!date){
      return res.status(400).json({message:"Please provide al the required expense details"});
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const userBudget = await Budget.findOne({ userId, month: currentMonth });

    if (!userBudget) {
      console.log(`User ${userId} tried to add expense without a budget for ${currentMonth}`);
      return res.status(400).json({ message: 'You must set up your monthly budget before adding expenses.' });
    }

    const categoryExistsInBudget = userBudget.categories.some(budgetCat => {
      const budgetCatIdFormat = budgetCat.name.toLowerCase().replace(/\s/g, '-');
      return budgetCatIdFormat === categoryId;
    });

    if (!categoryExistsInBudget) {
      console.log(`User ${userId} tried to add expense to category "${categoryId}" which is not in their budget.`);
      return res.status(400).json({ message: 'The selected category does not exist in your current budget. Please choose an existing category or update your budget.' });
    }

    const newExpense=new Expense({
      userId,
      categoryId,
      amount:Number(amount),
      description,
      date:new Date(date),
    });

    await newExpense.save();
    res.status(201).json({message:"Expense added successfully"});
  }catch(err){
    console.error("Error adding expense",err);
    res.status(500).json({
      message:"Server error while adding expense",error:err.message
    });
  }
});

//  Get Expenses Route 
app.get('/expenses', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query; // Expect YYYY-MM

    let query = { userId };

    if (month) {
      const year = parseInt(month.split('-')[0]);
      const monthNum = parseInt(month.split('-')[1]) - 1; // Months are 0-indexed in JS Date
      const startDate = new Date(year, monthNum, 1);
      const endDate = new Date(year, monthNum + 1, 0, 23, 59, 59, 999); // End of month

      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const expenses = await Expense.find(query).sort({ date: -1 }); // Sort by newest first
    res.status(200).json({ expenses });

  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses.', error: error.message });
  }
});

app.post('/target', authMiddleware, async (req, res) => {
  try {
    const { name, estimatedCost, targetMonth } = req.body;
    const userId = req.user.id; // Get user ID from authenticated token

    // Basic validation
    if (!name || !estimatedCost || Number(estimatedCost) <= 0 || !targetMonth) {
      return res.status(400).json({ message: 'Please provide all required target details (name, estimated cost, target month).' });
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const userBudget = await Budget.findOne({ userId, month: currentMonth });

    if (!userBudget) {
      return res.status(400).json({ message: 'You must set up your monthly budget before adding financial goals. Please set your budget first.' });
    }

    const existingTarget = await Target.findOne({ userId, targetMonth: currentMonth });

    if (existingTarget) {
      return res.status(400).json({
        message: `You already have a target for this month. Only one target is allowed per month.`
      });
    }

     if (Number(estimatedCost) > userBudget.monthlySavingsGoal) {
      return res.status(400).json({
        message: `Target cost cannot exceed your monthly savings goal.
Savings Goal: ₹${userBudget.monthlySavingsGoal}
Target Cost: ₹${estimatedCost}`
      });
    }

    const newTarget = new Target({
      userId,
      name: name.trim(),
      estimatedCost: Number(estimatedCost),
      targetMonth // YYYY-MM format
    });

    await newTarget.save();
    res.status(201).json({ message: 'Target added successfully!', target: newTarget });

  } catch (error) {
    console.error('Error adding target:', error);
    res.status(500).json({ message: 'Server error while adding target.', error: error.message });
  }
});

app.get('/targets', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch targets for this user
    const targets = await Target.find({ userId }).sort({ targetMonth: 1, createdAt: -1 });
    res.status(200).json({ targets });
  } catch (error) {
    console.error('Error fetching targets:', error);
    res.status(500).json({ message: 'Server error while fetching targets.' });
  }
});


// Route to delete a target
app.delete('/target/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id; 

    const target = await Target.findOneAndDelete({ _id: id, userId });

    if (!target) {
      return res.status(404).json({ message: 'Target not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ message: 'Target deleted successfully!' });

  } catch (error) {
    console.error('Error deleting target:', error);
    res.status(500).json({ message: 'Server error while deleting target.', error: error.message });
  }
});



app.listen(port,()=>{
  console.log(`server is listening to the port :${port}`);
});




