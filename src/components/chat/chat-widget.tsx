"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n";
import { z } from 'zod';

interface ChatWidgetProps {
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Input validation schema
const messageSchema = z.object({
  content: z.string().min(1).max(1000).trim(),
});

// Rate limiting state
interface RateLimitState {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_MAX = 20; // Max messages per window
const RATE_LIMIT_WINDOW = 60000; // 1 minute window

export function ChatWidget({ className = "" }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitState>({ count: 0, resetTime: Date.now() });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useTranslations();

  // Proactive welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownWelcome && !isOpen) {
        setHasShownWelcome(true);
        // Add welcome message to chat
        const welcomeMessage: Message = {
          id: "welcome",
          role: "assistant",
          content: t('chat.welcome', 'Hallo! 👋 Ik ben je Care & Service assistent. Hoe kan ik je helpen?'),
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hasShownWelcome, isOpen, t]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Rate limiting check
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now > rateLimit.resetTime) {
      setRateLimit({ count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return true;
    }
    
    // Check if under limit
    if (rateLimit.count < RATE_LIMIT_MAX) {
      setRateLimit(prev => ({ ...prev, count: prev.count + 1 }));
      return true;
    }
    
    return false;
  };

  // Sanitize message content
  const sanitizeContent = (content: string): string => {
    // For now, just return plain text - we can enhance later if needed
    return content.replace(/<[^>]*>/g, '').trim();
  };

  // Send message to API
  const sendMessage = async (content: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale || 'nl',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.content || t('chat.error', 'Sorry, er is een fout opgetreden. Probeer het opnieuw.');
    } catch (error) {
      console.error('Chat error:', error);
      return t('chat.error', 'Sorry, er is een fout opgetreden. Probeer het opnieuw.');
    }
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!checkRateLimit()) {
      alert(t('chat.rateLimitExceeded', 'Too many messages. Please wait a moment.'));
      return;
    }
    
    // Input validation
    try {
      messageSchema.parse({ content: input });
    } catch (validationError) {
      console.error('Input validation failed:', validationError);
      alert(t('chat.invalidInput', 'Invalid input. Please check your message.'));
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: sanitizeContent(input),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const assistantResponse = await sendMessage(userMessage.content);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: t('chat.error', 'Sorry, er is een fout opgetreden. Probeer het opnieuw.'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  };

  // Format timestamp safely
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            aria-label={t('chat.open', 'Open chat')}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Button>
          
          {/* Notification dot */}
          {messages.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
          )}
          
          {/* Welcome bubble */}
          {hasShownWelcome && (
            <div className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {t('chat.welcome', 'Hoe kunnen we u helpen? Vind snel betrouwbare professionals voor al uw behoeften in Spanje.')}
              </div>
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"></div>
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 sm:w-96 flex flex-col transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[32rem]'
        }`}>
          {/* Header */}
          <div className="bg-brand-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
              <div>
                <h3 className="font-semibold">Care & Service</h3>
                <p className="text-xs text-brand-100">{t('chat.assistant', 'AI Assistant')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                aria-label={isMinimized ? t('chat.maximize', 'Maximize') : t('chat.minimize', 'Minimize')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMinimized ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                aria-label={t('chat.close', 'Close')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                  {t('chat.startConversation', 'Start een gesprek met AI')}
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <p className={`text-xs mt-1 ${
                      message.role === "user" ? "text-brand-100" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          {!isMinimized && (
            <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('chat.placeholder', 'Typ je bericht...')}
                  className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={1}
                  disabled={isLoading}
                  maxLength={1000}
                  aria-label={t('chat.inputLabel', 'Chat message input')}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t('chat.send', 'Verstuur')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
              {input.length > 900 && (
                <p className="text-xs text-orange-500 mt-1">
                  {1000 - input.length} {t('chat.charactersLeft', 'karakters resterend')}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}