const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getAdvice } = require("../controllers/advisorController");

router.post("/", authMiddleware, getAdvice);

module.exports = router;