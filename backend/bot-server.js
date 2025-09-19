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

// Chat endpoint with intelligent language detection
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userInfo, documentContext, preferredLanguage } = req.body;
    
    // Detect Malayalam in the message
    const containsMalayalam = /[\u0D00-\u0D7F]/.test(message);
    const detectedLanguage = containsMalayalam ? 'ml' : 'en';
    const responseLanguage = preferredLanguage || detectedLanguage;
    
    let prompt;
    
    if (documentContext) {
      // Document-based query
      prompt = `You are Digital Krishi Officer, an expert AI assistant specialized in agriculture and farming.
      
Based on the following document content, please answer the user's question:

Document Content: ${documentContext}

User's question: ${message}

${responseLanguage === 'ml' ? 
  'Please respond in Malayalam (മലയാളം) since the user asked in Malayalam. Provide detailed agricultural advice in Malayalam. Use proper Malayalam grammar and farming terminology.' : 
  'Please respond in English for better understanding. Provide clear, practical agricultural advice.'
}

Response:`;
    } else {
      // General query with intelligent language preference
      const languageInstruction = responseLanguage === 'ml' ? 
        '\n\nSince the user communicated in Malayalam, please respond in Malayalam (മലയാളം). Provide detailed agricultural advice in Malayalam for Kerala farmers. Use proper Malayalam agricultural terms and be culturally appropriate for Kerala farming practices.' :
        '\n\nProvide your response in English with practical agricultural advice suitable for Indian farming conditions.';
      
      prompt = `You are Digital Krishi Officer, a helpful AI assistant for the I.F.C (Indian Farming Community) platform.

While you have specialized expertise in agriculture and farming, you are capable of answering questions on any topic. You help with:

**Agricultural Expertise:**
- Crop selection and farming techniques
- Pest control and disease management  
- Weather planning and seasonal advice
- Government schemes and subsidies
- Market prices and selling strategies
- Modern farming technology
- Sustainable and organic farming practices

**General Knowledge:**
- Technology and science
- Education and learning
- Health and wellness
- Business and finance
- Current events and general information
- Entertainment and lifestyle
- Any other topics users may ask about

User Context: ${userInfo ? `Name: ${userInfo.name}, Location: ${userInfo.location}, Crops: ${userInfo.crops || 'Various'}` : 'Anonymous user'}

User's question: ${message}${languageInstruction}

Guidelines for your responses:
- If responding in Malayalam: Use proper Malayalam grammar and appropriate terminology
- If responding in English: Use clear, simple language that is easy to understand
- Always provide helpful, accurate, and practical information
- For agricultural questions: Include specific advice relevant to Indian/Kerala farming conditions
- For non-agricultural questions: Provide comprehensive and useful answers
- Be friendly, encouraging and supportive in all interactions
- Adapt your response style to match the topic and user's needs

Response:`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      message: text,
      language: responseLanguage,
      detectedLanguage: detectedLanguage
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from Digital Krishi Officer',
      details: error.message 
    });
  }
});

// Enhanced chatbot endpoint for backward compatibility
app.post('/api/chatbot/ask', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Detect Malayalam content
    const containsMalayalam = /[\u0D00-\u0D7F]/.test(message);
    const responseLanguage = containsMalayalam ? 'ml' : 'en';
    
    // Create intelligent language instruction
    const languageInstruction = containsMalayalam 
      ? "Please respond in Malayalam (മലയാളം). Use proper Malayalam grammar and authentic agricultural terminology. Be culturally appropriate for Kerala farming practices."
      : "You can respond in English. Use clear, simple language that farmers can understand.";
    
    let prompt;
    
    if (context && context.document) {
      // Document-based query
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

While you are an expert in agriculture, farming techniques, government schemes, crop management, and rural development in India (particularly Kerala), you are also capable of answering questions on any topic.

${languageInstruction}

**Your Areas of Expertise Include:**

🌾 **Agricultural Specialization:**
- Farming techniques and crop management
- Pest control and disease prevention
- Government schemes and subsidies for farmers
- Modern farming technology and sustainable practices
- Kerala-specific agricultural advice
- Soil health and organic farming methods

🌍 **General Knowledge:**
- Technology, science, and innovation
- Education and career guidance
- Health, wellness, and lifestyle
- Business, finance, and entrepreneurship
- Current events and general information
- Entertainment, culture, and arts
- Any other topics users may inquire about

Guidelines for your responses:
- Provide helpful, accurate, and comprehensive information on any topic
- For agricultural questions: Include specific advice suitable for Indian/Kerala farming conditions
- For non-agricultural questions: Give detailed, practical answers appropriate to the topic
- Be encouraging, supportive, and friendly in all interactions
- Consider seasonal advice and local context when relevant
- If responding in Malayalam, ensure proper grammar and appropriate terminology
- If responding in English, use clear, accessible language
- Always aim to be genuinely helpful regardless of the question type

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
      language: responseLanguage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    // Provide fallback response in detected language
    const containsMalayalam = /[\u0D00-\u0D7F]/.test(req.body.message || '');
    const fallbackResponse = containsMalayalam 
      ? "ഞാൻ ഡിജിറ്റൽ കൃഷി ഓഫീസറാണ്, എന്നാൽ ഇപ്പോൾ നിങ്ങളുടെ ചോദ്യം പ്രോസസ് ചെയ്യുന്നതിൽ പ്രശ്നമുണ്ട്. നിങ്ങളുടെ സഹായിയായി, കൃഷി, സാങ്കേതികവിദ്യ, വിദ്യാഭ്യാസം, ആരോഗ്യം, അല്ലെങ്കിൽ മറ്റേതെങ്കിലും വിഷയത്തെക്കുറിച്ചുള്ള ചോദ്യങ്ങളിൽ സഹായിക്കാൻ ഞാൻ സന്തോഷിക്കുന്നു. ദയവായി വീണ്ടും ചോദിക്കുക!"
      : "I'm Digital Krishi Officer, but I'm having trouble processing your request right now. As your helpful assistant, I'd be happy to help with questions about farming, technology, education, health, or any other topic you'd like to discuss. Please try asking again!";

    res.status(500).json({
      success: false,
      message: 'Error generating response',
      fallbackResponse: fallbackResponse,
      language: containsMalayalam ? 'ml' : 'en',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Quick suggestions endpoint with multilingual support
app.get('/api/chatbot/suggestions', (req, res) => {
  const englishSuggestions = [
    "What crops are best for monsoon season?",
    "How to prevent pest attacks naturally?",
    "What are the latest farming technologies?",
    "How to start a small business in agriculture?",
    "What is artificial intelligence and its applications?",
    "Tips for healthy living and nutrition",
    "How to improve soil fertility organically?",
    "Best online learning platforms for skill development"
  ];

  const malayalamSuggestions = [
    "മഴക്കാലത്തിന് ഏറ്റവും നല്ല വിളകൾ ഏവയാണ്?",
    "പ്രകൃതിദത്ത മാർഗ്ഗങ്ങളിലൂടെ കീട ആക്രമണം എങ്ങനെ തടയാം?",
    "കൃഷിയിലെ ഏറ്റവും പുതിയ സാങ്കേതികവിദ്യകൾ എന്തൊക്കെയാണ്?",
    "കാർഷിക മേഖലയിൽ ചെറുകിട ബിസിനസ് എങ്ങനെ തുടങ്ങാം?",
    "കൃത്രിമ ബുദ്ധി എന്താണ്, അതിന്റെ ഉപയോഗങ്ങൾ എന്തൊക്കെ?",
    "ആരോഗ്യകരമായ ജീവിതത്തിനും പോഷകാഹാരത്തിനുമുള്ള നിർദ്ദേശങ്ങൾ",
    "ഓർഗാനിക് രീതിയിൽ മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത എങ്ങനെ വർദ്ധിപ്പിക്കാം?",
    "കഴിവ് വികസനത്തിനുള്ള മികച്ച ഓൺലൈൻ പഠന പ്ലാറ്റ്‌ഫോമുകൾ"
  ];

  res.json({
    success: true,
    suggestions: {
      en: englishSuggestions,
      ml: malayalamSuggestions
    }
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

    const { question, language } = req.body;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    console.log('Processing image upload:', req.file.originalname);

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Use Gemini Vision model for image analysis
    const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create language-aware prompt
    const ismalayalam = language === 'ml';
    const basePrompt = question || (ismalayalam 
      ? `ഈ ചിത്രം കൃഷിശാസ്ത്ര കാഴ്ചപ്പാടിൽ നിന്ന് വിശകലനം ചെയ്യുക. നിങ്ങൾ കാണുന്നത് വിവരിക്കുകയും പ്രസക്തമാണെങ്കിൽ കൃഷിയുമായി ബന്ധപ്പെട്ട ഉപദേശങ്ങൾ നൽകുകയും ചെയ്യുക.`
      : `Analyze this image from an agricultural perspective. Describe what you see and provide relevant farming advice if applicable.`
    );

    const detailedPrompt = ismalayalam 
      ? `${basePrompt}
ഇത് ഒരു വിളയോ ചെടിയോ ആണെങ്കിൽ, അത് തിരിച്ചറിഞ്ഞ് കൃഷിക്കുള്ള മികച്ച രീതികൾ നിർദ്ദേശിക്കുക.
ഇത് ഒരു കീടമോ രോഗമോ ആണെങ്കിൽ, തിരിച്ചറിയൽ, ചികിത്സാ ശുപാർശകൾ നൽകുക.
ഇത് കാർഷിക ഉപകരണമോ അടിസ്ഥാന സൗകര്യമോ ആണെങ്കിൽ, അതിന്റെ ഉപയോഗവും പരിപാലനവും വിശദീകരിക്കുക.

ദയവായി മലയാളത്തിൽ മറുപടി നൽകുക.`
      : `${basePrompt}
If it's a crop or plant, identify it and suggest best practices for cultivation.
If it's a pest or disease, provide identification and treatment recommendations.
If it's farm equipment or infrastructure, explain its use and maintenance.

Please respond in English.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    const result = await visionModel.generateContent([detailedPrompt, imagePart]);
    const response = await result.response;
    const analysis = response.text();

    console.log('Image analysis completed');

    res.json({
      success: true,
      analysis: analysis,
      filename: req.file.originalname,
      language: language || 'en',
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