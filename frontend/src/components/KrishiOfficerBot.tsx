import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader, 
  Lightbulb, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Paperclip,
  FileText,
  X,
  Mic,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  ChatMessage,
  sendMessageToBot,
  getBotSuggestions,
  checkBotHealth,
  generateMessageId,
  formatMessageTime,
  detectLanguage
} from '../services/chatbot';

// Custom Speech Recognition Hook
const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setBrowserSupportsSpeechRecognition(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Default to English, will be changed dynamically
      
      // Add support for multiple languages
      recognitionRef.current.maxAlternatives = 3;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
    }
  }, []);

  const startListening = (language?: 'en' | 'ml') => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      setTranscript('');
      // Set language for recognition
      recognitionRef.current.lang = language === 'ml' ? 'ml-IN' : 'en-US';
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening
  };
};

const KrishiOfficerBot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ en: string[]; ml: string[] }>({ en: [], ml: [] });
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ml'>('en');
  const [isHealthy, setIsHealthy] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
      setIsVoiceInput(true);
      // Auto-detect language from transcript
      const detectedLang = detectLanguage(transcript);
      setCurrentLanguage(detectedLang as 'en' | 'ml');
    }
  }, [transcript]);

  // Debug function to list available voices
  const listAvailableVoices = () => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:');
      voices.forEach((voice, index) => {
        console.log(`${index + 1}. ${voice.name} (${voice.lang}) - ${voice.localService ? 'Local' : 'Remote'}`);
      });
      return voices;
    }
    return [];
  };

  // Initialize voices on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Speech synthesis voices loaded');
          listAvailableVoices();
        }
      };
      
      // Voices might load asynchronously
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          loadVoices();
          window.speechSynthesis.onvoiceschanged = null;
        };
      } else {
        loadVoices();
      }
    }
  }, []);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize component
  useEffect(() => {
    const initializeBot = async () => {
      // Check bot health
      const healthy = await checkBotHealth();
      setIsHealthy(healthy);

      // Load suggestions
      const botSuggestions = await getBotSuggestions();
      setSuggestions(botSuggestions);

      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: generateMessageId(),
        text: `നമസ്കാരം ${user?.name || 'Friend'}! 🌾

I'm Digital Krishi Officer, your AI assistant. I'm here to help you with:

🌱 **Agricultural Expertise** - Crop management, pest control, disease prevention, farming techniques
🚰 **Irrigation & Water** - Efficient watering, water conservation methods
🌾 **Soil Health** - Testing, fertilizers, organic farming practices
💰 **Government Schemes** - Subsidies, loans, insurance for farmers
📈 **Market Information** - Prices, trends, selling strategies
🔬 **Modern Techniques** - Technology, equipment, sustainable farming

**Plus Any Other Topics:**
💻 Technology & Science | 📚 Education & Learning | 💊 Health & Wellness
💼 Business & Finance | 🌍 Current Events | 🎭 Entertainment & Culture

How can I assist you today? I can answer questions on farming or any other topic!

എനിക്ക് മലയാളത്തിലും ഇംഗ്ലീഷിലും സംസാരിക്കാൻ കഴിയും!`,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages([welcomeMessage]);
    };

    initializeBot();
  }, [user]);

  // Text-to-Speech function with language detection and text cleaning
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any previous speech
      window.speechSynthesis.cancel();
      
      // Clean the text by removing markdown symbols and special characters
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown **text**
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown *text*
        .replace(/#{1,6}\s/g, '') // Remove heading markers # ## ###
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`([^`]+)`/g, '$1') // Remove inline code `text`
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url)
        .replace(/[🌾🌱🚰💰📈🔬💻📚💊💼🌍🎭✅❌🔄⭐️📊🎯]/g, '') // Remove emojis
        .replace(/[•\-*]\s/g, '') // Remove bullet points
        .replace(/^\s*[\d]+\.\s/gm, '') // Remove numbered lists
        .replace(/_{2,}/g, '') // Remove underscores
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Detect language and set appropriate voice
      const containsMalayalam = /[\u0D00-\u0D7F]/.test(text);
      utterance.lang = containsMalayalam ? 'ml-IN' : 'en-US';
      utterance.rate = 0.8; // Slightly slower for better clarity
      utterance.pitch = 1;
      utterance.volume = 0.9;
      
      // Function to get voices and speak
      const getVoicesAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        
        if (containsMalayalam) {
          // Try to find Malayalam voice
          const malayalamVoice = voices.find(voice => 
            voice.lang === 'ml-IN' || 
            voice.lang.includes('ml') ||
            voice.name.toLowerCase().includes('malayalam') ||
            voice.name.toLowerCase().includes('india')
          );
          if (malayalamVoice) {
            utterance.voice = malayalamVoice;
            console.log('Using Malayalam voice:', malayalamVoice.name);
          } else {
            // Fallback to any Indian English voice for Malayalam
            const indianVoice = voices.find(voice => 
              voice.lang === 'en-IN' || 
              voice.name.toLowerCase().includes('india')
            );
            if (indianVoice) {
              utterance.voice = indianVoice;
              console.log('Using Indian English voice for Malayalam:', indianVoice.name);
            }
          }
        } else {
          // For English, prefer Indian English or US English
          const englishVoice = voices.find(voice => 
            voice.lang === 'en-IN' || 
            voice.lang === 'en-US' ||
            voice.name.toLowerCase().includes('india')
          );
          if (englishVoice) {
            utterance.voice = englishVoice;
            console.log('Using English voice:', englishVoice.name);
          }
        }
        
        // Add error handling for speech synthesis
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
        };
        
        utterance.onend = () => {
          console.log('Speech synthesis completed');
        };
        
        window.speechSynthesis.speak(utterance);
      };

      // Voices may load asynchronously
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          getVoicesAndSpeak();
          window.speechSynthesis.onvoiceschanged = null; // Remove listener after first call
        };
      } else {
        getVoicesAndSpeak();
      }
    } else {
      console.warn('Text-to-speech not supported in this browser.');
    }
  };

  // Handle sending message
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    
    if (!textToSend || isLoading) return;

    // Stop any ongoing speech before sending a new message
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Detect language from input if not voice input
    if (!isVoiceInput) {
      const detectedLang = detectLanguage(textToSend);
      setCurrentLanguage(detectedLang as 'en' | 'ml');
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);
    resetTranscript();

    let context: string | null = null;

    // If a document is loaded, search for context first
    if (documentId && uploadedFile) {
      try {
        const searchResponse = await fetch('http://localhost:5001/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document_id: documentId,
            query: textToSend,
            k: 3 // Get top 3 relevant chunks
          }),
        });
        if (searchResponse.ok) {
          const searchResult = await searchResponse.json();
          if (searchResult.results && searchResult.results.length > 0) {
            context = searchResult.results.join('\n\n---\n\n');
          }
        }
      } catch (error) {
        console.error('Error searching document:', error);
      }
    }

    try {
      // Send to bot
      const response = await sendMessageToBot(
        textToSend,
        {
          userName: user?.name,
          userLocation: user?.location,
          userCropType: user?.cropType,
          userLandSize: user?.acresOfLand
        },
        context || undefined,
        isVoiceInput // Pass voice input flag
      );

      // Add bot response
      const botMessage: ChatMessage = {
        id: generateMessageId(),
        text: response.response || response.fallbackResponse || 'I apologize, but I encountered an issue. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        language: response.language
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the message if voice is enabled AND it was a voice input
      if (voiceEnabled && isVoiceInput) {
        speakMessage(botMessage.text);
      }

      // Reset voice input flag
      setIsVoiceInput(false);

      // Show error if API failed but we have fallback
      if (!response.success && response.fallbackResponse) {
        console.warn('Bot API Error:', response.message);
      }

    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        text: "I'm having trouble connecting right now. As Digital Krishi Officer, I'm here to help with farming questions, technology, education, health, or any other topic you'd like to discuss. Please check your internet connection and try again!",
        sender: 'bot',
        timestamp: new Date(),
        language: 'en'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      if (voiceEnabled && isVoiceInput) {
        speakMessage(errorMessage.text);
      }

      // Reset voice input flag
      setIsVoiceInput(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File, fileType: 'pdf' | 'image') => {
    if (!file) return;

    setIsProcessingFile(true);
    setDocumentId(null);

    const processingMessage: ChatMessage = {
      id: generateMessageId(),
      text: `Processing your ${fileType}: **${file.name}**...`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, processingMessage]);

    const formData = new FormData();
    
    try {
      let response;
      
      if (fileType === 'pdf') {
        // Handle PDF upload to Python backend
        formData.append('file', file);
        response = await fetch('http://localhost:5001/process-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('PDF processing failed.');
        }

        const result = await response.json();
        setDocumentId(result.document_id);
        setUploadedFile(file);

        const successMessage: ChatMessage = {
          id: generateMessageId(),
          text: `✅ **${file.name}** is ready! You can now ask me questions about it.`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        
        if (voiceEnabled) {
          speakMessage(successMessage.text);
        }

      } else if (fileType === 'image') {
        // Handle image upload to Node.js backend for analysis
        formData.append('image', file);
        formData.append('question', 'Analyze this image from an agricultural perspective');
        
        response = await fetch('http://localhost:5000/api/chatbot/analyze-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image analysis failed.');
        }

        const result = await response.json();
        
        const analysisMessage: ChatMessage = {
          id: generateMessageId(),
          text: `🖼️ **Image Analysis Results:**\n\n${result.analysis}`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, analysisMessage]);
        
        if (voiceEnabled) {
          speakMessage(analysisMessage.text);
        }
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        text: `I'm sorry, I couldn't process **${file.name}**. Please try again.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      speakMessage(errorMessage.text);
      setUploadedFile(null);
    } finally {
      setIsProcessingFile(false);
      // Reset file input to allow re-uploading the same file
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'pdf' | 'image') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileType === 'pdf' && file.type === 'application/pdf') {
      handleFileUpload(file, 'pdf');
    } else if (fileType === 'image' && file.type.startsWith('image/')) {
      handleFileUpload(file, 'image');
    } else {
      setUploadedFile(null);
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        text: `Invalid file type. Please upload a ${fileType === 'pdf' ? 'PDF' : 'image'}.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      speakMessage(errorMessage.text);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleVoiceRecording = () => {
    if (listening) {
      stopListening();
    } else {
      resetTranscript();
      startListening(currentLanguage);
    }
  };

  // Refresh bot health
  const handleRefreshHealth = async () => {
    const healthy = await checkBotHealth();
    setIsHealthy(healthy);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Bot className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Digital Krishi Officer</h1>
            <div className="flex items-center space-x-2">
              {isHealthy ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <button
                onClick={handleRefreshHealth}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Check connection"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Your AI-powered farming assistant for crop management, modern techniques, and agricultural guidance
          </p>
          {!isHealthy && (
            <div className="mt-3 px-4 py-2 bg-amber-100 border border-amber-300 rounded-lg text-amber-800 text-sm">
              ⚠️ Backend connection issue. Some features may be limited.
            </div>
          )}
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Messages Area */}
          <div className="h-96 md:h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-100' 
                        : 'bg-green-100'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-green-600" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.text}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 text-green-600 animate-spin" />
                      <span className="text-sm text-gray-600">Digital Krishi Officer is typing...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Suggestions */}
            {showSuggestions && suggestions[currentLanguage]?.length > 0 && messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentLanguage === 'ml' ? 'വേഗത്തിലുള്ള ചോദ്യങ്ങൾ:' : 'Quick Questions:'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestions[currentLanguage].slice(0, 6).map((suggestion: string, index: number) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200 text-sm"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'ml' : 'en')}
                    className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {currentLanguage === 'en' ? 'മലയാളത്തിൽ കാണുക' : 'View in English'}
                  </button>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            {uploadedFile && (
              <div className="mb-3 p-2 bg-green-100 border border-green-200 rounded-lg flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">{uploadedFile.name}</span>
                </div>
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setDocumentId(null);
                  }}
                  className="p-1 text-green-700 hover:text-green-900"
                  disabled={isProcessingFile}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                type="file"
                ref={pdfInputRef}
                onChange={(e) => handleFileChange(e, 'pdf')}
                className="hidden"
                accept="application/pdf"
                disabled={isProcessingFile}
              />
              <input
                type="file"
                ref={imageInputRef}
                onChange={(e) => handleFileChange(e, 'image')}
                className="hidden"
                accept="image/*"
                disabled={isProcessingFile}
              />
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                title="Upload PDF"
                disabled={isProcessingFile}
              >
                <FileText className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                title="Upload Image"
                disabled={isProcessingFile}
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={handleVoiceRecording}
                className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 ${
                  listening ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 hover:bg-gray-100'
                }`}
                title={listening ? 'Stop listening' : `Start voice input (${currentLanguage === 'ml' ? 'Malayalam' : 'English'})`}
                disabled={!browserSupportsSpeechRecognition || isProcessingFile}
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  voiceEnabled ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-300 hover:bg-gray-100'
                }`}
                title={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
              >
                <Volume2 className="h-5 w-5" />
              </button>
              
              {/* Test Voice Button */}
              {voiceEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    const testText = currentLanguage === 'ml' 
                      ? 'ഞാൻ ഡിജിറ്റൽ കൃഷി ഓഫീസറാണ്. മലയാളത്തിൽ സംസാരിക്കാൻ കഴിയും.' 
                      : 'I am Digital Krishi Officer. I can speak in English.';
                    speakMessage(testText);
                  }}
                  className="p-2 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
                  title="Test voice output"
                >
                  🔊
                </button>
              )}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    listening 
                      ? `Listening in ${currentLanguage === 'ml' ? 'Malayalam' : 'English'}...`
                      : documentId 
                        ? `Ask about ${uploadedFile?.name || 'the document'}...`
                        : currentLanguage === 'ml' 
                          ? "കൃഷിയെക്കുറിച്ചോ മറ്റെന്തെങ്കിലുമോ ചോദിക്കൂ..."
                          : "Ask about farming or any other topic..."
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isLoading || isProcessingFile}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || isProcessingFile || !inputMessage.trim()}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Status indicator */}
            <div className="mt-2 text-xs text-gray-500 text-center flex justify-center items-center">
              {isHealthy ? (
                <span className="flex items-center justify-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Connected to Digital Krishi Officer</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-1">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  <span>Limited mode - Some features may not work</span>
                </span>
              )}
              {!browserSupportsSpeechRecognition && (
                <span className="flex items-center justify-center space-x-1 ml-4">
                  <Mic className="h-3 w-3 text-red-500" />
                  <span>Voice input not supported in this browser.</span>
                </span>
              )}
              {browserSupportsSpeechRecognition && (
                <span className="flex items-center justify-center space-x-1 ml-4">
                  <Mic className="h-3 w-3 text-green-500" />
                  <span>Malayalam voice input ready</span>
                </span>
              )}
              {voiceEnabled && (
                <span className="flex items-center justify-center space-x-1 ml-4">
                  <Volume2 className="h-3 w-3 text-blue-500" />
                  <span>Voice output enabled</span>
                </span>
              )}
              {documentId && (
                <span className="flex items-center justify-center space-x-1 ml-4">
                  <FileText className="h-3 w-3 text-green-500" />
                  <span>Ready to answer questions about <strong>{uploadedFile?.name}</strong></span>
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">🌾 Crop Guidance</h3>
            <p className="text-sm text-gray-600">Get expert advice on crop selection, planting, harvesting, and pest management.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">💰 Government Schemes</h3>
            <p className="text-sm text-gray-600">Learn about subsidies, loans, insurance, and financial support programs.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">🚀 Modern Farming</h3>
            <p className="text-sm text-gray-600">Discover latest techniques, technology, and sustainable farming practices.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KrishiOfficerBot;