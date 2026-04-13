const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

// ✅ MongoDB Retry Connection (FINAL FIX)
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://mongodb:27017/testdb");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ MongoDB not ready, retrying in 5 sec...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

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

app.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});