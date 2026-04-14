import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const useChats = () => {
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    const loadChats = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`/api/users/${currentUser.user.id}/chats`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch chats');
        const data = await response.json();
        setChatList(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    loadChats();
  }, [currentUser]);

  return { chatList, activeChat, setActiveChat, isAddChatModalOpen, setIsAddChatModalOpen };
};

export default useChats;