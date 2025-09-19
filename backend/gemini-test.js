require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env file.');
    return;
  }

  console.log('🔑 Found Gemini API Key. Initializing...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('🤖 Gemini model initialized. Sending a test prompt...');

    const prompt = 'Hello! Are you working? Respond with a short confirmation.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! Received response from Gemini:');
    console.log('-------------------------------------------');
    console.log(text);
    console.log('-------------------------------------------');
    console.log('Conclusion: Your Gemini API key and connection are working correctly!');

  } catch (error) {
    console.error('❌ FAILED: An error occurred while testing Gemini API.');
    console.error('Error Details:', error.message);
    if (error.details) {
      console.error(error.details);
    }
    console.log('\nPossible reasons for failure:');
    console.log('1. The API key is invalid, expired, or has restrictions.');
    console.log('2. The Google Cloud project for the API key is not properly configured (e.g., billing not set up).');
    console.log('3. A network firewall is blocking the connection to Google\'s servers.');
  }
}

testGemini();
