const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { addTarget, getTargets, deleteTarget } = require("../controllers/targetController");

router.post("/", authMiddleware, addTarget);
router.get("/", authMiddleware, getTargets);
router.delete("/:id", authMiddleware, deleteTarget);

module.exports = router;