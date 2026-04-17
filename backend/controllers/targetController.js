const Target = require("../models/Target");
const Budget = require("../models/Budget");

exports.addTarget = async (req, res) => {

  try {

    const { name, estimatedCost, targetMonth } = req.body;

    const userId = req.user.id;

    if (!name || !estimatedCost || Number(estimatedCost) <= 0 || !targetMonth) {
      return res.status(400).json({ message: "Please provide all required target details." });
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    const userBudget = await Budget.findOne({ userId, month: currentMonth });

    if (!userBudget) {
      return res.status(400).json({ message: "Set your budget before adding targets." });
    }

    const existingTarget = await Target.findOne({ userId, targetMonth: currentMonth });

    if (existingTarget) {
      return res.status(400).json({ message: "Only one target allowed per month." });
    }

    if (Number(estimatedCost) > userBudget.monthlySavingsGoal) {
      return res.status(400).json({ message: "Target exceeds savings goal." });
    }

    const newTarget = new Target({
      userId,
      name: name.trim(),
      estimatedCost: Number(estimatedCost),
      targetMonth
    });

    await newTarget.save();

    res.status(201).json({ message: "Target added successfully!", target: newTarget });

  } catch (error) {

    res.status(500).json({ message: "Server error while adding target." });

  }

};


exports.getTargets = async (req, res) => {

  try {

    const userId = req.user.id;

    const targets = await Target.find({ userId }).sort({ targetMonth: 1, createdAt: -1 });

    res.status(200).json({ targets });

  } catch (error) {

    res.status(500).json({ message: "Server error while fetching targets." });

  }

};


exports.deleteTarget = async (req, res) => {

  try {

    const { id } = req.params;
    const userId = req.user.id;

    const target = await Target.findOneAndDelete({ _id: id, userId });

    if (!target) {
      return res.status(404).json({ message: "Target not found." });
    }

    res.status(200).json({ message: "Target deleted successfully!" });

  } catch (error) {

    res.status(500).json({ message: "Server error while deleting target." });

  }

};