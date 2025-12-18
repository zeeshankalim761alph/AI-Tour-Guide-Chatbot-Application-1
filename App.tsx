import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Role, Language } from './types';
import { geminiService } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';
import { QuickReplies } from './components/QuickReplies';
import { downloadChatAsText } from './utils/fileUtils';

// Helper for UUID since we can't easily import uuid lib without package.json control in some envs
// We'll use a simple random string generator for this purpose if uuid is not available, 
// but since I'm allowed "popular libraries" and typically uuid is standard, I'll simulate it or implement a simple one.
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wanderlust_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    } else {
      // Initial greeting
      addMessage({
        id: generateId(),
        role: Role.MODEL,
        text: "Hello! I'm your WanderLust Guide. 🌍✈️\n\nI can help you plan trips, find amazing food, and discover hidden gems. Where would you like to go today?",
        timestamp: Date.now()
      });
    }
  }, []);

  // Save to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('wanderlust_chat', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: generateId(),
      role: Role.USER,
      text: text.trim(),
      timestamp: Date.now()
    };

    addMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the updated history including the new user message
      const history = [...messages, userMsg];
      const response = await geminiService.sendMessage(history, text, language);

      const botMsg: Message = {
        id: generateId(),
        role: Role.MODEL,
        text: response.text,
        timestamp: Date.now(),
        groundingChunks: response.groundingChunks
      };

      addMessage(botMsg);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsLoading(false);
      // Keep focus on input for desktop
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('wanderlust_chat');
      addMessage({
        id: generateId(),
        role: Role.MODEL,
        text: language === 'en' 
          ? "Chat cleared! Where to next? 🌍" 
          : "چیٹ صاف کر دی گئی! اگلی منزل کون سی ہے؟ 🌍",
        timestamp: Date.now()
      });
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  return (
    <div className="flex flex-col h-screen bg-sand-50 text-gray-800">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-travel-500 to-travel-300 h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-md">
            <i className="fa-solid fa-earth-americas text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg text-travel-900 leading-tight">WanderLust</h1>
            <p className="text-xs text-travel-600 font-medium">AI Travel Companion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-gray-100 text-travel-700 font-bold text-sm border border-travel-100 w-10 h-10 flex items-center justify-center transition-colors"
            title="Switch Language"
          >
            {language === 'en' ? 'EN' : 'اردو'}
          </button>
          
          <button 
            onClick={() => downloadChatAsText(messages)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 w-10 h-10 flex items-center justify-center transition-colors"
            title="Download Itinerary"
          >
            <i className="fa-solid fa-download"></i>
          </button>
          
          <button 
            onClick={handleClearChat}
            className="p-2 rounded-full hover:bg-red-50 text-red-500 w-10 h-10 flex items-center justify-center transition-colors"
            title="Clear Chat"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
               <div className="flex flex-row gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white text-travel-600 flex items-center justify-center shadow-md border border-gray-100">
                    <i className="fa-solid fa-plane-departure"></i>
                  </div>
                  <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-travel-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-travel-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-travel-600 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          
          {/* Quick Replies */}
          <QuickReplies onSelect={handleSend} language={language} />

          {/* Text Input */}
          <div className="flex gap-2 items-end bg-gray-50 border border-gray-300 rounded-3xl px-4 py-2 focus-within:ring-2 focus-within:ring-travel-400 focus-within:border-transparent transition-all shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'en' ? "Ask about a destination, itinerary, or food..." : "منزل، سفر کے منصوبے یا کھانے کے بارے میں پوچھیں..."}
              className={`flex-1 bg-transparent border-none focus:ring-0 outline-none py-2 max-h-32 ${language === 'ur' ? 'text-right' : ''}`}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`mb-1 p-2 rounded-full h-10 w-10 flex items-center justify-center transition-all ${
                input.trim() 
                  ? 'bg-travel-600 text-white shadow-md hover:bg-travel-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className={`fa-solid ${language === 'ur' ? 'fa-paper-plane fa-flip-horizontal' : 'fa-paper-plane'}`}></i>
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] text-gray-400">
              Powered by Google Gemini • AI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;