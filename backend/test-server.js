const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Import chatbot routes
try {
  const chatbotRoutes = require('./routes/chatbot');
  app.use('/api/chatbot', chatbotRoutes);
  console.log('✅ Chatbot routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading chatbot routes:', error.message);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/test`);
  console.log(`🤖 Chatbot Health: http://localhost:${PORT}/api/chatbot/health`);
});