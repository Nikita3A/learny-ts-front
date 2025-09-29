// src/components/AI/AIChat.tsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AIChat = ({ unitId, lessonId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    // Implement chat logic using your API
  };

  return (
    <div className="flex flex-col h-full bg-darkGray">
      <div className="p-4 border-b border-mediumGray">
        <h3 className="text-white font-bold">AI Tutor</h3>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Chat messages */}
      </div>
      <div className="p-4 border-t border-mediumGray">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-mediumGray text-white p-2 rounded"
          placeholder="Ask about this lesson..."
        />
      </div>
    </div>
  );
};
export default AIChat;