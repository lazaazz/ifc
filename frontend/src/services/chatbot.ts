import axios from 'axios';

// Backend API base URL - adjust if your backend runs on different port
const API_BASE_URL = 'http://localhost:5000/api/chatbot';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  fallbackResponse?: string;
  message?: string;
  error?: string;
}

export interface SuggestionsResponse {
  success: boolean;
  suggestions: string[];
}

// Send message to Digital Krishi Officer
export const sendMessageToBot = async (
  message: string, 
  userInfo?: any, 
  documentContext?: string
): Promise<ChatResponse> => {
  try {
    const payload: { message: string; context: any } = {
      message: message.trim(),
      context: {
        ...userInfo,
      },
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
        fallbackResponse: "I'm Digital Krishi Officer, but I'm currently offline. Please check your connection and try again. I'm here to help with all your farming questions!"
      };
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        message: 'Request timeout',
        fallbackResponse: "Sorry, I'm taking too long to respond. As Digital Krishi Officer, I'm here to help with farming advice. Please try asking your question again!"
      };
    }

    // Handle server response errors
    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
      fallbackResponse: "I'm Digital Krishi Officer, and something went wrong. I'm here to help with crop cultivation, livestock care, farming techniques, and agricultural advice. Please try again!"
    };
  }
};

// Get quick suggestions
export const getBotSuggestions = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/suggestions`, {
      timeout: 10000 // 10 second timeout
    });

    if (response.data.success) {
      return response.data.suggestions;
    }
    
    return getDefaultSuggestions();
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return getDefaultSuggestions();
  }
};

// Default suggestions when API is unavailable
const getDefaultSuggestions = (): string[] => [
  "What crops are best for monsoon season?",
  "How to prevent pest attacks naturally?",
  "What government schemes are available for farmers?",
  "Best irrigation methods for water conservation",
  "How to improve soil fertility organically?",
  "Market prices for wheat and rice today",
  "Modern farming techniques for small farmers",
  "How to get agricultural loans?"
];

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