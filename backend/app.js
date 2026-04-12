const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb://mongodb:27017/testdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

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
  console.log("Backend running on port 5000");
});