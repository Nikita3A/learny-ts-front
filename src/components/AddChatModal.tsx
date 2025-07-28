import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface AddChatModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  refreshChats: () => Promise<void>;
}

const AddChatModal: React.FC<AddChatModalProps> = ({ isOpen, onRequestClose, refreshChats }) => {
  const [chatName, setChatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleAddChat = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!chatName.trim()) return;
    setIsSubmitting(true);
    try {
      const body = JSON.stringify({
        id: currentUser.user.id,
        name: chatName
      });
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'Content-Type': 'application/json'
        },
        body
      });
      if (!response.ok) throw new Error('Failed to create. Server response: ' + JSON.stringify(response));
      setChatName('');
      onRequestClose();
      if (refreshChats) await refreshChats();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Chat"
      className="flex items-center justify-center min-h-screen px-4 py-12 bg-secondaryBackgroundDark"
      overlayClassName="custom-modal-overlay"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddChatModal;
