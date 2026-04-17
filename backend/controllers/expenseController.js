const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

exports.addExpense = async (req, res) => {

  try {

    const { categoryId, amount, description, date } = req.body;

    const userId = req.user.id;

    if (!categoryId || !amount || Number(amount) <= 0 || !description || !date) {
      return res.status(400).json({ message: "Please provide all required expense details" });
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    const userBudget = await Budget.findOne({ userId, month: currentMonth });

    if (!userBudget) {
      return res.status(400).json({ message: "You must set up your monthly budget before adding expenses." });
    }

    const categoryExists = userBudget.categories.some(cat => {
      const catId = cat.name.toLowerCase().replace(/\s/g, "-");
      return catId === categoryId;
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist in your budget." });
    }

    const newExpense = new Expense({
      userId,
      categoryId,
      amount: Number(amount),
      description,
      date: new Date(date)
    });

    await newExpense.save();

    res.status(201).json({ message: "Expense added successfully" });

  } catch (err) {

    res.status(500).json({ message: "Server error while adding expense" });

  }

};


exports.getExpenses = async (req, res) => {

  try {

    const userId = req.user.id;
    const { month } = req.query;

    let query = { userId };

    if (month) {

      const year = parseInt(month.split("-")[0]);
      const monthNum = parseInt(month.split("-")[1]) - 1;

      const startDate = new Date(year, monthNum, 1);
      const endDate = new Date(year, monthNum + 1, 0, 23, 59, 59, 999);

      query.date = {
        $gte: startDate,
        $lte: endDate
      };

    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.status(200).json({ expenses });

  } catch (error) {

    res.status(500).json({ message: "Server error while fetching expenses." });

  }

};