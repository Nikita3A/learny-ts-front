import React from 'react';
import '../../src/scrollbar.css'; // Adjust the path according to your project structure

const ChatList = ({ chats, onAddChat, onChatSelect }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Scrollable chat list */}
      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-2 scrollbar-hidden">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center bg-darkGray rounded-lg p-2 text-white"
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <img 
                src={chat.picture} 
                alt={`${chat.name} profile`} 
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="flex-grow ml-4">
              <div className="text-lg font-semibold">{chat.name}</div>
              <div className="text-gray-400 text-sm truncate">
                {chat.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Add Chat button */}
      <div className="px-4 py-2 bg-dark">
        <button
          onClick={onAddChat}
          className="w-full flex items-center justify-center bg-green text-white text-lg font-semibold rounded-lg py-2 border border-mediumGray"
        >
          Add Chat
        </button>
      </div>
    </div>
  );
};

export default ChatList;
