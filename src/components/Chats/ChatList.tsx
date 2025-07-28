import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import AddChatModal from '../AddChatModal';
import { RootState } from '../../redux/store';

import '../../scrollbar.css'; // Adjust the path according to your project structure

interface Chat {
  id: string;
  name: string;
  picture?: string;
  lastMessage?: string;
}

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal state
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // Open modal
  const onAddChat = () => {
    setIsAddModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  // Refresh chats after adding
  const refreshChats = useCallback(async () => {
    if (!currentUser?.accessToken) return;
    try {
      const userId = currentUser.user.id;
      const response = await fetch(`/api/users/${userId}/chats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const serverChats = await response.json();
        setChats(serverChats);
      }
    } catch {
      // Optionally handle error
    }
  }, [currentUser]);

  useEffect(() => {
    refreshChats();
  }, [currentUser, refreshChats]); // Re-fetch if the user context or refreshChats changes

  return (
    <div className="flex flex-col h-full">
      {/* AddChatModal for creating new chat */}
      <AddChatModal
        isOpen={isAddModalOpen}
        onRequestClose={handleCloseModal}
        refreshChats={refreshChats}
      />
      {/* Scrollable chat list */}
      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-2 scrollbar-hidden">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center bg-darkGray rounded-lg p-2 text-white"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center">
              {chat.picture && (
                <img 
                  src={chat.picture}  
                  className="w-10 h-10 rounded-full"
                  alt="chat avatar"
                />
              )}
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
