const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

// ✅ MongoDB connection with retry loop (production style)
const connectDB = async () => {
  while (true) {
    try {
      await mongoose.connect("mongodb://mongo-service:27017/testdb");
      console.log("✅ MongoDB connected");
      break;
    } catch (err) {
      console.log("❌ MongoDB not ready, retrying in 5 sec...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

// Schema
const DataSchema = new mongoose.Schema({
  message: String,
});

const Data = mongoose.model("Data", DataSchema);

// API
app.get("/api", async (req, res) => {
  try {
    let data = await Data.findOne();

    if (!data) {
      data = await Data.create({ message: "Hello from MongoDB" });
    }

    res.json({ message: data.message });
  } catch (err) {
    res.json({ message: "DB error" });
  }
});

// 🚀 Start server AFTER DB is ready
const startServer = async () => {
  await connectDB();

  app.listen(5000, () => {
    console.log("🚀 Backend running on port 5000");
  });
};

startServer();
