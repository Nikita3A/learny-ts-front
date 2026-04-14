// src/components/Courses/AIAssistantChat.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Suggestion {
  field: string;
  value: string;
  label?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: string;
  suggestions?: Suggestion[];
}

interface CourseData {
  name?: string;
  description?: string;
  [key: string]: unknown;
}

interface AIAssistantChatProps {
  courseData: CourseData;
  onSuggestionAccept: (field: string, value: string) => void;
  onBack?: () => void;
}

// Mock AI call - replace with real API integration behind your backend
async function getAIResponseMock(message: string, courseData: CourseData) {
  await new Promise((res) => setTimeout(res, 700));

  const lower = message.toLowerCase();

  if (lower.includes('name')) {
    if (!courseData.name) {
      return {
        text: "Sure — here's a suggestion for a course name: 'Introduction to React'.",
        suggestions: [
          { field: 'name', value: 'Introduction to React', label: 'Use this name' }
        ]
      };
    }
    return {
      text: `I see you have a name. Here's an enhanced option: ${courseData.name} - Complete Guide`,
      suggestions: [
        { field: 'name', value: `${courseData.name} - Complete Guide`, label: 'Use enhanced name' }
      ]
    };
  }

  if (lower.includes('description')) {
    if (!courseData.description) {
      return {
        text: "Here's a description suggestion: 'Learn React from basics to advanced concepts with hands-on projects.'",
        suggestions: [
          { field: 'description', value: 'Learn React from basics to advanced concepts with hands-on projects.', label: 'Use this description' }
        ]
      };
    }
    return {
      text: `Would you like to improve your description? I can rewrite it more concisely or add learning outcomes.`,
      suggestions: []
    };
  }

  return { text: "I can help with structure, content ideas, or improve current details. What would you like?", suggestions: [] };
}

const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ courseData, onSuggestionAccept, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `m-${Date.now()}`,
      text: "Hello! I'm your AI assistant. How can I help you create your course?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const appendMessage = useCallback((msg: Omit<Message, 'id'>) => {
    const id = `m-${Date.now()}-${idCounter.current++}`;
    setMessages((prev) => [...prev, { ...msg, id }]);
  }, []);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;

    appendMessage({
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setInputValue('');
    setIsLoading(true);

    try {
      // TODO: replace mock with real API call through your backend
      const resp = await getAIResponseMock(text, courseData);

      appendMessage({
        text: resp.text,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: resp.suggestions
      });
    } catch (err) {
      console.error('AI assistant error', err);
      appendMessage({
        text: "Sorry, I couldn't process that. Please try again.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, appendMessage, courseData]);

  const handleSuggestionClick = useCallback((field: string, value: string) => {
    onSuggestionAccept(field, value);
  }, [onSuggestionAccept]);

  return (
    <div className="flex flex-col h-full bg-dark rounded-lg overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-2/3 break-words ${message.sender === 'user' ? 'bg-darkGray text-white ml-auto' : 'bg-mediumGray text-white mr-auto'} border border-transparent`}> 
              <p className="whitespace-pre-wrap">{message.text}</p>
              <div className="flex items-center justify-end mt-2 space-x-2">
                {message.suggestions?.map((sugg, idx) => (
                  <button key={idx} onClick={() => handleSuggestionClick(sugg.field, sugg.value)} className="px-3 py-1 bg-green text-white text-sm rounded-md hover:bg-green-dark transition-colors">
                    {sugg.label ?? sugg.value}
                  </button>
                ))}
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-2 rounded-lg max-w-2/3 break-words bg-mediumGray text-white mr-auto border border-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-mediumGray">
        <form onSubmit={handleSend} className="space-y-2" aria-label="AI assistant form">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for help with your course..."
              className="flex-1 rounded-md bg-darkGray border border-mediumGray text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green"
              disabled={isLoading}
            />

            <button
              aria-disabled={isLoading || !inputValue.trim()}
              disabled={isLoading || !inputValue.trim()}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isLoading || !inputValue.trim() ? 'border-2 border-mediumGray cursor-not-allowed' : 'bg-green text-white hover:bg-green-dark'}`}
              type="submit"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                'Send'
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400">Try asking: "Suggest a course name" or "Help improve my description"</p>
        </form>
      </footer>
    </div>
  );
};

export default AIAssistantChat;
