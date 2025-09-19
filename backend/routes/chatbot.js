const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.API_KEY,
});

// ✅ Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    geminiApiConfigured: !!process.env.API_KEY,
  });
});

// ✅ Suggestions route
router.get("/suggestions", (req, res) => {
  res.json({
    success: true,
    suggestions: [
      "What crops are best for monsoon season?",
      "How to prevent pest attacks naturally?",
      "What government schemes are available for farmers?",
      "Best irrigation methods for water conservation",
      "How to improve soil fertility organically?",
      "Market prices for wheat and rice today",
    ],
  });
});

// ✅ Chat route
router.post("/ask", async (req, res) => {
  const { message, context } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      `User message: ${message}`,
      `Context: ${JSON.stringify(context || {})}`,
    ]);

    res.json({
      success: true,
      response: result.response.text(),
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.json({
      success: false,
      fallbackResponse:
        "I'm Digital Krishi Officer. I couldn’t process your request right now, please try again later.",
      message: err.message,
    });
  }
});

module.exports = router;
