import React, { useState } from 'react';

const QuestionType3 = ({ question, correctAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleCheckAnswer = () => {
    setIsCorrect(answer.trim().toLowerCase() === correctAnswer.toLowerCase());
  };

  return (
    <div className="p-4 bg-dark text-white rounded-lg w-full h-full flex flex-col">
      <h3 className="text-xl mb-4">{question}</h3>
      <textarea
        className="scrollbar-hidden p-2 mb-4 rounded-lg w-full flex-grow text-white bg-mediumGray focus:outline-none focus:ring-2 focus:ring-green"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ minHeight: '200px' }} // Ensures a decent minimum height
      />
      <button
        className="bg-green text-white p-2 rounded-lg"
        onClick={handleCheckAnswer}
      >
        Submit Answer
      </button>
      {isCorrect !== null && (
        <div className={`mt-4 ${isCorrect ? 'text-green' : 'text-red-500'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </div>
      )}
    </div>
  );
};

export default QuestionType3;
