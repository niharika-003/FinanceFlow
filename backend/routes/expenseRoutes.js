const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { addExpense, getExpenses } = require("../controllers/expenseController");

router.post("/addexpense", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);

module.exports = router;