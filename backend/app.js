const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const targetRoutes = require("./routes/targetRoutes");
const advisorRoutes = require("./routes/advisorRoutes");

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FinanceFlow API running");
});

app.use("/auth", authRoutes);
app.use("/budget", budgetRoutes);
app.use("/expenses", expenseRoutes);
app.use("/targets", targetRoutes);
app.use("/advisor", advisorRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});