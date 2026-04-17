const mongoose = require("mongoose");

const dburl = "mongodb://localhost:27017/FinanceFlow";
// const dburl=process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to DB");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;