import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddUserModal = ({ isOpen, onRequestClose, chat }) => {
  const [userName, setuserName] = useState('');
  const currentUser = useSelector(state => state.user.currentUser);

  const handleAddUserToChat = async (event) => {
    event.preventDefault();
    
    try {
      const user = await axios.get(`/api/users/${userName}`);

      console.log('ui: ', user.data.id);
      console.log('chat: ', chat.id);
      await axios.put(`/api/chats/${chat.id}/users/${user.data.id}`);
  
      // Close the modal
      onRequestClose();
    } catch (error) {
      console.error("Error adding chat: ", error);
    }
    setuserName('');
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add user to chat"
      className="flex items-center justify-center min-h-screen px-4 py-12 bg-secondaryBackgroundDark"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="w-full max-w-md p-8 space-y-4 bg-darkGray rounded-lg relative">
        <h2 className="text-2xl font-extrabold text-white">Add User</h2>
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 m-4 text-white bg-green p-2 rounded"
        >
          Close
        </button>
        <form onSubmit={handleAddUserToChat} className="flex flex-col items-center">
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
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

export default AddUserModal;
