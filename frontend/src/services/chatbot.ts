import axios from 'axios';

// Backend API base URL - adjust if your backend runs on different port
const API_BASE_URL = 'http://localhost:5000/api/chatbot';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  fallbackResponse?: string;
  message?: string;
  error?: string;
  language?: string;
}

export interface SuggestionsResponse {
  success: boolean;
  suggestions: {
    en: string[];
    ml: string[];
  };
}

// Detect language in text
export const detectLanguage = (text: string): string => {
  const malayalamPattern = /[\u0D00-\u0D7F]/;
  return malayalamPattern.test(text) ? 'ml' : 'en';
};

// Send message to Digital Krishi Officer with language detection
export const sendMessageToBot = async (
  message: string, 
  userInfo?: any, 
  documentContext?: string,
  isVoiceInput?: boolean
): Promise<ChatResponse> => {
  try {
    const detectedLanguage = detectLanguage(message);
    
    const payload: { 
      message: string; 
      context: any;
      preferredLanguage?: string;
      isVoiceInput?: boolean;
    } = {
      message: message.trim(),
      context: {
        ...userInfo,
      },
      preferredLanguage: detectedLanguage,
      isVoiceInput: isVoiceInput || false
    };

    if (documentContext) {
      payload.context.document = documentContext;
    }

    const response = await axios.post(`${API_BASE_URL}/ask`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 second timeout
    });

    return response.data;
  } catch (error: any) {
    console.error('Error sending message to bot:', error);
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return {
        success: false,
        message: 'Unable to connect to Digital Krishi Officer. Please make sure the backend server is running.',
        fallbackResponse: "I'm Digital Krishi Officer, but I'm currently offline. Please check your connection and try again. I'm here to help with farming, technology, education, health, or any other questions you might have!",
        language: 'en'
      };
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        message: 'Request timeout',
        fallbackResponse: "Sorry, I'm taking too long to respond. As Digital Krishi Officer, I'm here to help with farming advice, technology questions, health tips, or any other topic you'd like to discuss. Please try asking your question again!",
        language: 'en'
      };
    }

    // Handle server response errors
    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
      fallbackResponse: "I'm Digital Krishi Officer, and something went wrong. I'm here to help with farming, technology, education, health, business, or any other topic you'd like to discuss. Please try again!",
      language: 'en'
    };
  }
};

// Get quick suggestions with multilingual support
export const getBotSuggestions = async (): Promise<{ en: string[]; ml: string[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/suggestions`, {
      timeout: 10000 // 10 second timeout
    });

    if (response.data.success && response.data.suggestions) {
      return response.data.suggestions;
    }
    
    return getDefaultSuggestions();
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return getDefaultSuggestions();
  }
};

// Default suggestions when API is unavailable
const getDefaultSuggestions = (): { en: string[]; ml: string[] } => ({
  en: [
    "What crops are best for monsoon season?",
    "How to prevent pest attacks naturally?",
    "What are the latest farming technologies?",
    "How to start a small business in agriculture?",
    "What is artificial intelligence and its applications?",
    "Tips for healthy living and nutrition",
    "How to improve soil fertility organically?",
    "Best online learning platforms for skill development"
  ],
  ml: [
    "മഴക്കാലത്തിന് ഏറ്റവും നല്ല വിളകൾ ഏവയാണ്?",
    "പ്രകൃതിദത്ത മാർഗ്ഗങ്ങളിലൂടെ കീട ആക്രമണം എങ്ങനെ തടയാം?",
    "കൃഷിയിലെ ഏറ്റവും പുതിയ സാങ്കേതികവിദ്യകൾ എന്തൊക്കെയാണ്?",
    "കാർഷിക മേഖലയിൽ ചെറുകിട ബിസിനസ് എങ്ങനെ തുടങ്ങാം?",
    "കൃത്രിമ ബുദ്ധി എന്താണ്, അതിന്റെ ഉപയോഗങ്ങൾ എന്തൊക്കെ?",
    "ആരോഗ്യകരമായ ജീവിതത്തിനും പോഷകാഹാരത്തിനുമുള്ള നിർദ്ദേശങ്ങൾ",
    "ഓർഗാനിക് രീതിയിൽ മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത എങ്ങനെ വർദ്ധിപ്പിക്കാം?",
    "കഴിവ് വികസനത്തിനുള്ള മികച്ച ഓൺലൈൻ പഠന പ്ലാറ്റ്‌ഫോമുകൾ"
  ]
});

// Check if chatbot service is healthy
export const checkBotHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000 // 5 second timeout
    });
    
    return response.data.success && response.data.geminiApiConfigured;
  } catch (error) {
    console.error('Bot health check failed:', error);
    return false;
  }
};

// Generate unique message ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Format message timestamp
export const formatMessageTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};