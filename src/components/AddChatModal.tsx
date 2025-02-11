import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddChatModal = ({ isOpen, onRequestClose, setChats }) => {
  const [chatName, setChatName] = useState('');
  const currentUser = useSelector(state => state.user.currentUser);

  const handleAddChat = async (event) => {
    event.preventDefault();
  
    try {      
      const response = await axios.post('/api/chats', {
        id: currentUser.user.id, // Use the user ID from the Redux store
        name: chatName,
      });
  
      // Close the modal
      onRequestClose();
  
      // Refresh the chat list
      const chatResponse = await axios.get(`/api/users/${currentUser.user.id}/chats`);
      setChats(chatResponse.data);
    } catch (error) {
      console.error("Error adding chat: ", error);
    }
  
    setChatName('');
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Chat"
      className="flex items-center justify-center min-h-screen px-4 py-12 bg-secondaryBackgroundDark"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="w-full max-w-md p-8 space-y-4 bg-darkGray rounded-lg relative">
        <h2 className="text-2xl font-extrabold text-white">Add Chat</h2>
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 m-4 text-white bg-green p-2 rounded"
        >
          Close
        </button>
        <form onSubmit={handleAddChat} className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="w-full p-2 rounded-lg text-white bg-mediumGray focus:border-green focus:ring-green focus:outline-none focus:ring focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="w-full mt-4 text-white bg-green p-2 rounded"
          >
            Add
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddChatModal;
