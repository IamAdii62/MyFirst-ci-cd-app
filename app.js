const express = require("express");
const app = express();

  res.send("CI/CD AUTO WORKING ✅");
app.get("/", (req, res) => {});

app.listen(3000, () => {
  console.log("App running on port 3000");
});
