const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Chat endpoint
router.post('/ask', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Create agriculture-focused prompt
    const agriculturalPrompt = `You are Digital Krishi Officer, an expert AI assistant specialized in agriculture and farming. 
    You help farmers with advice on crops, livestock, pest control, weather planning, modern farming techniques, 
    government schemes, market prices, and sustainable farming practices.

    Context: This is a conversation in the I.F.C (Indian Farming Community) platform.

    User's question: ${message}

    Please provide a helpful, accurate, and practical response focused on agriculture. 
    Keep your response conversational but informative. If the question is not related to farming or agriculture, 
    politely redirect the conversation back to agricultural topics.

    Response:`;

    // Generate response using Gemini
    const result = await model.generateContent(agriculturalPrompt);
    const response = await result.response;
    const botReply = response.text();

    res.json({
      success: true,
      response: botReply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    // Fallback response for errors
    const fallbackResponses = [
      "I'm Digital Krishi Officer, and I'm having trouble processing your request right now. As your farming assistant, I'd be happy to help with questions about crop cultivation, pest management, or agricultural techniques. Please try asking again!",
      "It seems there's a technical issue on my end. I'm Digital Krishi Officer, here to help with all your farming and agriculture questions. Could you please rephrase your question?",
      "I apologize for the inconvenience. I'm Digital Krishi Officer, and while I sort this out, I can help you with topics like crop selection, soil management, irrigation, livestock care, or government farming schemes. What would you like to know?"
    ];

    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    res.status(500).json({
      success: false,
      message: 'Error generating response',
      fallbackResponse: randomFallback,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Quick suggestions endpoint
router.get('/suggestions', (req, res) => {
  const suggestions = [
    "What crops are best for monsoon season?",
    "How to prevent pest attacks naturally?",
    "What government schemes are available for farmers?",
    "Best irrigation methods for water conservation",
    "How to improve soil fertility organically?",
    "Market prices for wheat and rice today",
    "Modern farming techniques for small farmers",
    "How to get agricultural loans?"
  ];

  res.json({
    success: true,
    suggestions: suggestions
  });
});

// Health check for chatbot service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Digital Krishi Officer Chatbot Service is running',
    geminiApiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;