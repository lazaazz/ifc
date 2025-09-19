const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Chat endpoint
app.post('/api/chatbot/ask', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Create a dynamic prompt based on context
    let prompt;
    
    // Detect if the user is asking in Malayalam
    const containsMalayalam = /[\u0D00-\u0D7F]/.test(message);
    const languageInstruction = containsMalayalam 
      ? "Please respond in Malayalam (മലയാളം). If you don't know how to answer in Malayalam, respond in English but include Malayalam greetings or terms where appropriate."
      : "You can respond in English or Malayalam as appropriate. If the user seems to prefer Malayalam or mentions Malayalam terms, feel free to include Malayalam in your response.";
    
    if (context && context.document) {
      // Prompt for answering based on a document
      prompt = `You are a helpful AI assistant for the I.F.C (Indian Farming Community) platform.
Your current task is to answer a user's question based *only* on the provided document context.
Do not use any external knowledge. If the answer is not in the document, say "I could not find the answer in the document."

${languageInstruction}

**Document Context:**
---
${context.document}
---

**User's Question:**
${message}

**Answer:**`;
    } else {
      // General-purpose prompt with enhanced multilingual support
      prompt = `You are the Digital Krishi Officer, a helpful AI assistant for the I.F.C (Indian Farming Community) platform. 
You are an expert in agriculture, farming techniques, government schemes, crop management, and rural development in India, particularly Kerala.

${languageInstruction}

Guidelines for your responses:
- If asked about farming/agriculture: Provide detailed, practical advice suitable for Indian farming conditions
- Include information about government schemes, subsidies, and modern farming techniques when relevant
- Be encouraging and supportive to farmers
- Use simple, clear language that farmers can understand
- If you use Malayalam, ensure it's grammatically correct
- Include seasonal advice when appropriate
- Mention organic farming and sustainable practices when relevant

**User Information:** ${context?.userName ? `Name: ${context.userName}` : ''}${context?.userLocation ? `, Location: ${context.userLocation}` : ''}${context?.userCropType ? `, Crop: ${context.userCropType}` : ''}${context?.userLandSize ? `, Land Size: ${context.userLandSize} acres` : ''}

**User's Question:**
${message}

**Response:**`;
    }

    console.log('Sending request to Gemini API...');
    
    // Generate response using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();

    console.log('Received response from Gemini API');

    res.json({
      success: true,
      response: botReply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    // Fallback response for errors
    const fallbackResponse = "I'm Digital Krishi Officer, but I'm having trouble processing your request right now. As your farming assistant, I'd be happy to help with questions about crop cultivation, pest management, or agricultural techniques. Please try asking again!";

    res.status(500).json({
      success: false,
      message: 'Error generating response',
      fallbackResponse: fallbackResponse,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Quick suggestions endpoint
app.get('/api/chatbot/suggestions', (req, res) => {
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
app.get('/api/chatbot/health', (req, res) => {
  res.json({
    success: true,
    message: 'Digital Krishi Officer Chatbot Service is running',
    geminiApiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Image upload and analysis endpoint
app.post('/api/chatbot/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { question } = req.body;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    console.log('Processing image upload:', req.file.originalname);

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Use Gemini Vision model for image analysis
    const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = question || `Analyze this image from an agricultural perspective. 
Describe what you see and provide relevant farming advice if applicable. 
If it's a crop or plant, identify it and suggest best practices for cultivation.
If it's a pest or disease, provide identification and treatment recommendations.
If it's farm equipment or infrastructure, explain its use and maintenance.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    const analysis = response.text();

    console.log('Image analysis completed');

    res.json({
      success: true,
      analysis: analysis,
      filename: req.file.originalname,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Krishi Officer Bot Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: http://localhost:3001`);
  console.log(`🤖 Bot Health: http://localhost:${PORT}/api/chatbot/health`);
  console.log(`🔑 Gemini API Configured: ${!!process.env.GEMINI_API_KEY}`);
});

module.exports = app;