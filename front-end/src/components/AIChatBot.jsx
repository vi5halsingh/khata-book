import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { IoClose, IoSend } from 'react-icons/io5';
import { MdChat } from 'react-icons/md';

const deriveSocketUrl = () => {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit) return explicit;

  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase) {
    try {
      const url = new URL(apiBase);
      return `${url.protocol}//${url.host}`;
    } catch (error) {
      return apiBase.replace(/\/api.*$/, '');
    }
  }

  return 'http://localhost:3000';
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

function formatReference(ref) {
  if (!ref?.metadata) return null;
  const { type, amount, description, date } = ref.metadata;
  const formattedAmount = Number(amount || 0).toFixed(2);
  const formattedDate = date
    ? new Date(date).toLocaleDateString()
    : 'Unknown date';

  return `${type || 'transaction'} • ${formattedDate} • Rs. ${formattedAmount} • ${
    description || 'No description'
  }`;
}

function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: createId(),
      text: "Hi! I'm your AI assistant. I can help you analyze your transactions and answer questions about your financial data. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const historyRef = useRef([]);
  const messagesEndRef = useRef(null);

  const socketUrl = useMemo(() => deriveSocketUrl(), []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Login is required to use the AI assistant.');
      return;
    }

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token
      }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat:connected', () => {
      setError(null);
    });

    socket.on('chat:bot_typing', () => {
      setIsLoading(true);
    });

    socket.on('chat:bot_response', (payload) => {
      setIsLoading(false);
      const botMessage = {
        id: createId(),
        text: payload?.text || 'I was unable to generate a response.',
        sender: 'bot',
        timestamp: new Date(),
        references: payload?.references || []
      };

      setMessages((prev) => [...prev, botMessage]);
      historyRef.current = [
        ...historyRef.current,
        { role: 'model', text: botMessage.text }
      ].slice(-10);
    });

    socket.on('chat:error', (payload) => {
      setIsLoading(false);
      const message =
        payload?.message ||
        'Something went wrong while contacting the assistant.';
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          text: message,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    });

    socket.on('connect_error', (err) => {
      setIsConnected(false);
      setError(err.message || 'Unable to connect to AI assistant.');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [socketUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!socketRef.current || !isConnected) {
      setError('Connection lost. Reconnecting...');
      socketRef.current?.connect();
      return;
    }

    const userMessage = {
      id: createId(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    historyRef.current = [
      ...historyRef.current,
      { role: 'user', text: trimmed }
    ].slice(-10);

    socketRef.current.emit('chat:user_message', {
      message: trimmed,
      history: historyRef.current
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110"
        title="Open AI Chat"
      >
        <MdChat className="text-2xl" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden backdrop-blur-lg">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  {message.references?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.references.map((ref) => {
                        const content = formatReference(ref);
                        if (!content) return null;
                        return (
                          <p
                            key={`${message.id}-${ref.id}`}
                            className="text-xs text-gray-300 border-t border-gray-600 pt-1"
                          >
                            {content}
                          </p>
                        );
                      })}
                    </div>
                  )}
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

          <div className="border-t border-gray-700 p-4 bg-gray-800/50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={
                  isConnected
                    ? 'Ask about your transactions...'
                    : 'Connecting to assistant...'
                }
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                disabled={isLoading || !isConnected}
              />
              <button
                type="submit"
                disabled={
                  isLoading || !inputValue.trim() || !isConnected
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center"
              >
                <IoSend className="text-lg" />
              </button>
            </form>
            {error && (
              <p className="text-xs text-red-400 mt-2">{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatBot;
