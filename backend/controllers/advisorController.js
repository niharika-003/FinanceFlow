const { GoogleGenAI } = require("@google/genai");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

exports.getAdvice = async (req, res) => {

  try {

    const { question } = req.body;
    const userId = req.user.id;

    const currentMonth = new Date().toISOString().slice(0, 7);

    const budget = await Budget.findOne({ userId, month: currentMonth });

    const year = parseInt(currentMonth.split("-")[0]);
    const monthNum = parseInt(currentMonth.split("-")[1]) - 1;

    const startDate = new Date(year, monthNum, 1);
    const endDate = new Date(year, monthNum + 1, 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalIncome = budget ? budget.monthlyIncome : 0;
    const savingsGoal = budget ? budget.monthlySavingsGoal : 0;

    let expenseSummary = "No expenses recorded yet.";

    if (expenses.length > 0) {

      const expenseMap = {};

      expenses.forEach(exp => {
        expenseMap[exp.categoryId] = (expenseMap[exp.categoryId] || 0) + exp.amount;
      });

      expenseSummary = Object.entries(expenseMap)
        .map(([cat, amount]) => `${cat}: ₹${amount}`)
        .join(", ");

    }

    const prompt = `
You are an expert financial coach.

Income: ₹${totalIncome}
Savings Goal: ₹${savingsGoal}
Expenses: ${expenseSummary}

User question: ${question || "Give a short financial tip"}

Answer under 3 sentences.
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    res.status(200).json({ tip: response.text });

  } catch (error) {

    res.status(500).json({ message: "Error generating financial advice." });

  }

};