import React, { useState } from 'react';

const QuestionType1 = ({
  selected = null,
  isCorrect = null,
  question = 'Question',
  options = ['Option 1', 'Option 2', 'Option 3'],
  correctAnswer = 'Option 1',
  onNext,
  isAnswerCorrect,
  handleSelect = () => {},
}) => {
  // const [selected, setSelected] = useState(null);
  // const [isCorrect, setIsCorrect] = useState(null);

  // const handleSelect = (index, option, correctAnswer) => {
  //   console.log('index: ', index, 'option: ', option);
  //   console.log('cra: ' correctAnswer);

  //   setSelected(option);
  //   setIsCorrect(option === correctAnswer);
  // };

  return (
    <div className="p-4 w-full bg-dark text-white rounded-lg">
      <h3 className="text-xl mb-4">{question}</h3>
      <div>
        {options.map((option, index) => (
          <div key={index} className="mb-2">
            <button
              className={`p-2 rounded-lg w-full text-left transition-colors duration-300 ${
                selected === option
                  ? isAnswerCorrect
                    ? 'bg-green hover:bg-green'
                    : 'bg-red hover:bg-red'
                  : 'bg-darkGray hover:bg-mediumGray'
              }`}
              onClick={() => handleSelect(option, correctAnswer)}
            >
              {option}
            </button>
          </div>
        ))}
      </div>
      {isAnswerCorrect !== null && (
        <div className={`mt-4 ${isAnswerCorrect ? 'text-green' : 'text-red'}`}>
          {isAnswerCorrect ? 'Correct!' : 'Incorrect!'}
        </div>
      )}
    </div>
  );
};

export default QuestionType1;
