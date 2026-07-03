// Load environment variables FIRST
require("dotenv").config();

// Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const taskRoutes = require("./routes/taskRoutes");

// App setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/tasks", taskRoutes);

// Default route (test)
app.get("/", (req, res) => {
  res.send("Welcome to my MERN Task Management Dashboard!");
});

// MongoDB Connection
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message);
  });

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(  `🚀 Server is running on port ${PORT}`);
});