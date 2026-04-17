const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createBudget,
  getBudget,
} = require("../controllers/budgetController");

router.post("/", authMiddleware, createBudget);
router.get("/", authMiddleware, getBudget);

module.exports = router;