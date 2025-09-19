const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const chatbotRoutes = require("./routes/chatbot");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/chatbot", chatbotRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
