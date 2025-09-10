import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatList from '../components/Chats/ChatList';
import ChatWindow from '../components/Chats/ChatWindow';
import AddChatModal from '../components/AddChatModal';
import AddUserModal from '../components/AddUserModal';
import useChats from '../hooks/useChats';
import useChatSocket from '../hooks/useChatSocket';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ChatsPage = () => {
  const { chatList, isAddChatModalOpen, setIsAddChatModalOpen } = useChats();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const currentUserId = currentUser?.user?.id;

  // Find the selected chat by ID from the URL
  const selectedChat = chatList.find((chat: any) => String(chat.id) === String(chatId));
  const { messageList, handleSendMessage } = useChatSocket(selectedChat);

  // Handle chat selection: update URL
  const handleChatSelect = (chat: any) => {
    navigate(`/chats/${chat.id}`);
  };

  // Refresh chats for AddChatModal
  const refreshChats = useCallback(async () => {
    // You may want to refetch chats here, for now reload page
    window.location.reload();
  }, []);

  // Open AddUserModal from ChatWindow's addUser
  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };
  console.log('Chat ID:', chatId);
  console.log('Chat List:', chatList);

  return (
    <div className="flex h-full">
      <ChatList chats={chatList} onChatSelect={handleChatSelect} onAddChat={() => setIsAddChatModalOpen(true)} />
      <div className="flex-grow">
        {chatId && selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messageList}
            addUser={handleAddUser}
            onSubmitMessage={handleSendMessage}
            currentUserId={currentUserId}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat to view messages.
          </div>
        )}
      </div>
      <AddChatModal isOpen={isAddChatModalOpen} onRequestClose={() => setIsAddChatModalOpen(false)} refreshChats={refreshChats} />
      <AddUserModal isOpen={isAddUserModalOpen} onRequestClose={() => setIsAddUserModalOpen(false)} chat={selectedChat} />
    </div>
  );
};

export default ChatsPage;