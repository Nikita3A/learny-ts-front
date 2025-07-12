import React, { useState } from 'react';

const QuestionType1 = ({ question, options, correctAnswer, onNext }) => {
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsCorrect(option === correctAnswer);
  };

  return (
    <div className="p-4 w-full bg-dark text-white rounded-lg">
      <h3 className="text-xl mb-4">{question}</h3>
      <div>
        {options.map((option, index) => (
          <div key={index} className="mb-2">
            <button
              className={`p-2 rounded-lg w-full text-left transition-colors duration-300 ${
                selected === option
                  ? isCorrect
                    ? 'bg-green hover:bg-green'
                    : 'bg-red hover:bg-red'
                  : 'bg-darkGray hover:bg-mediumGray'
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          </div>
        ))}
      </div>
      {isCorrect !== null && (
        <div className={`mt-4 ${isCorrect ? 'text-green' : 'text-red'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </div>
      )}
    </div>
  );
};

export default QuestionType1;
