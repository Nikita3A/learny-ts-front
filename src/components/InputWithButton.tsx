import React, { useState } from 'react';

const InputWithButton = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(inputValue);
      setInputValue(''); // Clear input after submission
    }
  };

  return (
    <div className="relative flex items-center py-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="flex-grow p-2 pr-10 rounded-lg bg-darkGray text-white outline-none"
        placeholder="Type your message..."
      />
      <button
        onClick={handleSubmit}
        className="absolute right-3 text-green flex items-center justify-center"
      >
        <img src="/arrowInCircle.png" alt="Enter" className="w-6 h-6" />
      </button>
    </div>
  );
  
};

export default InputWithButton;
