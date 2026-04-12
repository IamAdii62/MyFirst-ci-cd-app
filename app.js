const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// 🔥 FIX: Use environment variable instead of hardcoded IP
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

app.get("/", async (req, res) => {
  let message = "Loading...";

  try {
    const response = await fetch(`${BACKEND_URL}/api`);
    const data = await response.json();
    message = data.message;
  } catch (err) {
    message = "Backend not connected";
  }

  res.send(`
    <html>
    <head>
      <title>CI/CD App</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .card {
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        h1 {
          font-size: 40px;
          margin-bottom: 10px;
        }
        p {
          font-size: 18px;
        }
        .badge {
          margin-top: 20px;
          display: inline-block;
          padding: 10px 20px;
          background: #00ffcc;
          color: black;
          border-radius: 20px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🚀 CI/CD SUCCESS</h1>
        <p>${message}</p>
        <div class="badge">Frontend + Backend Connected</div>
      </div>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Frontend running on port 3000");
});