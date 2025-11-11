import React, { useState, useRef, useEffect } from 'react';
import { IoClose, IoSend } from 'react-icons/io5';
import { MdChat } from 'react-icons/md';

function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can help you analyze your transactions and answer questions about your financial data. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // TODO: Send to backend AI API
    // For now, we'll simulate a response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "I'm processing your request. This feature is coming soon! I'll be able to analyze your transactions and provide insights.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110"
        title="Open AI Chat"
      >
        <MdChat className="text-2xl" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MdChat className="text-xl" />
              <h3 className="text-lg font-bold text-white">Transaction AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-all"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-700 p-4 bg-gray-800/50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your transactions..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center"
              >
                <IoSend className="text-lg" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatBot;
