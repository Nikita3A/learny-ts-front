import React, { useState } from 'react';

const QuestionType2 = ({ question, options, correctAnswers=[] }) => {
  const [selected, setSelected] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option) => {
    if (isAnswered) return; // Prevent further selection after checking answers

    setSelected((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option) // Deselect
        : [...prevSelected, option] // Select
    );
  };

  const checkAnswers = () => {
    setIsAnswered(true); // Mark the question as answered
  };

  return (
    <div className="p-4 bg-dark text-white rounded-lg">
      <h3 className="text-xl mb-4">{question}</h3>
      <div>
        {options.map((option, index) => (
          <div key={index} className="mb-2">
            <button
              className={`p-2 rounded-lg w-full text-left
                ${isAnswered && correctAnswers.includes(option) ? 'bg-green' : ''}
                ${isAnswered && selected.includes(option) && !correctAnswers.includes(option) ? 'bg-red' : ''}
                ${!isAnswered && selected.includes(option) ? 'bg-mediumGray' : ''}
                ${!isAnswered && !selected.includes(option) ? 'bg-darkGray' : ''}
              `}
              onClick={() => handleSelect(option)}
              disabled={isAnswered} // Disable buttons after checking answers
            >
              {option}
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-4 bg-green text-white p-2 rounded-lg"
        onClick={checkAnswers}
        disabled={isAnswered} // Disable the button after checking answers
      >
        {isAnswered ? 'Checked' : 'Check Answer'}
      </button>
    </div>
  );
};

export default QuestionType2;
