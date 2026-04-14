import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { RootState } from '../redux/store';

const useChatSocket = (activeChat) => {
  const [messageList, setMessageList] = useState([]);
  const [socketConnection, setSocketConnection] = useState(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    if (!activeChat) return;
    const chatSocket = io('http://localhost:3000/chat', {
      query: { chatId: activeChat.id },
    });

    chatSocket.emit('joinChat', activeChat.id);
    chatSocket.emit('requestMessages', activeChat.id);

    chatSocket.on('chatToClient', (receivedMessages) => {
      setMessageList(receivedMessages);
    });

    setSocketConnection(chatSocket);
    setMessageList([]);

    return () => {
      chatSocket.emit('leaveChat', activeChat.id);
      chatSocket.disconnect();
    };
  }, [activeChat]);

  const handleSendMessage = (messageText) => {
    if (socketConnection && messageText.trim() !== '') {
      socketConnection.emit('sendMessage', {
        text: messageText,
        userId: currentUser.user.id,
        chatId: activeChat ? activeChat.id : 'ai',
      });

      socketConnection.on('newMessage', (newMessage) => {
        const enrichedMessage = {
          ...newMessage,
          user: {
            id: currentUser.user.id,
            username: currentUser.user.username,
          },
        };
        setMessageList((prevMessages) => [...prevMessages, enrichedMessage]);
      });
    }
  };

  const addUser = () => {
    // Implement add user modal logic if needed
  };

  return { messageList, handleSendMessage, addUser };
};

export default useChatSocket;
