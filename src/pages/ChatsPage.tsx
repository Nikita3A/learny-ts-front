import React, { useCallback, useState, useEffect } from 'react';
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentUserId = currentUser?.user?.id;

  // Check if the screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset showChatList when navigating to /chats without a chatId
  useEffect(() => {
    if (!chatId) {
      setShowChatList(true);
    }
  }, [chatId]);

  const selectedChat = chatList.find((chat) => String(chat.id) === String(chatId));
  const { messageList, handleSendMessage } = useChatSocket(selectedChat);

  const handleChatSelect = (chat) => {
    if (isMobileView) {
      setShowChatList(false); // Hide chat list on mobile when a chat is selected
    }
    navigate(`/chats/${chat.id}`);
  };

  const handleBackToChatList = () => {
    setShowChatList(true); // Show chat list again on mobile
    navigate('/chats');
  };

  const refreshChats = useCallback(async () => {
    window.location.reload();
  }, []);

  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  return (
    <div className="flex h-full">
      {(showChatList || !isMobileView) && (
        <div className={isMobileView ? 'w-full' : 'w-1/6'}>
          <ChatList
            chats={chatList}
            onChatSelect={handleChatSelect}
            onAddChat={() => setIsAddChatModalOpen(true)}
          />
        </div>
      )}
      {!isMobileView || !showChatList ? (
        <div className={isMobileView ? 'w-full' : 'flex-grow'}>
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
      ) : null}
      <AddChatModal isOpen={isAddChatModalOpen} onRequestClose={() => setIsAddChatModalOpen(false)} refreshChats={refreshChats} />
      <AddUserModal isOpen={isAddUserModalOpen} onRequestClose={() => setIsAddUserModalOpen(false)} chat={selectedChat} />
    </div>
  );
};

export default ChatsPage;