const Budget = require("../models/Budget");

exports.createBudget = async (req, res) => {
  try {
    const { monthlyIncome, categories, monthlySavingsGoal } = req.body;

    const userId = req.user.id;
    const month = new Date().toISOString().slice(0, 7);

    const budgetCategories = categories.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      allocated: Number(cat.allocated || 0),
    }));

    let budget = await Budget.findOne({ userId, month });

    if (budget) {
      budget.monthlyIncome = monthlyIncome;
      budget.categories = budgetCategories;
      budget.monthlySavingsGoal = monthlySavingsGoal;

      await budget.save();

      return res.json({ message: "Budget updated", budget });
    }

    budget = new Budget({
      userId,
      month,
      monthlyIncome,
      categories: budgetCategories,
      monthlySavingsGoal,
    });

    await budget.save();

    res.status(201).json({ message: "Budget created", budget });
  } catch (error) {
    res.status(500).json({ message: "Error creating budget" });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const userId = req.user.id;

    const month = req.query.month || new Date().toISOString().slice(0, 7);

    const budget = await Budget.findOne({ userId, month });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ budget });
  } catch (error) {
    res.status(500).json({ message: "Error fetching budget" });
  }
};