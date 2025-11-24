import React from 'react';

const QuestionType1 = ({
  question = 'Question',
  options = ['Option 1', 'Option 2', 'Option 3'],
  selected = null,
  correctAnswer = '',
  isAnswerCorrect = null,
  handleSelect = (option: string) => {},
}: {
  question?: string;
  options?: string[];
  selected?: string | null;
  correctAnswer?: string | string[] | null;
  isAnswerCorrect?: boolean | null;
  handleSelect?: (option: string) => void;
}) => {
  return (
    <div className="p-6 bg-dark rounded-lg shadow-md">
      <h3 className="text-xl md:text-2xl font-semibold text-white mb-5">{question}</h3>

      <div className="grid gap-4">
        {options.map((option, index) => {
          const isSelected = selected === option;
          const base = 'rounded-md text-left transition-colors duration-150 w-full';
          const padding = 'px-5 py-3 md:px-6 md:py-4';
          const stateCls = isSelected
            ? isAnswerCorrect === null
              ? 'ring-2 ring-blue bg-darkGray text-white'
              : isAnswerCorrect
                ? 'bg-green text-white'
                : 'bg-red text-white'
            : 'bg-darkGray hover:bg-mediumGray text-white';
          return (
            <button
              key={index}
              className={`${base} ${padding} ${stateCls} text-base md:text-lg`}
              onClick={() => handleSelect(option)}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswerCorrect !== null && (
        <div className={`mt-4 ${isAnswerCorrect ? 'text-green' : 'text-red-400'} text-lg font-medium`}>
          {isAnswerCorrect ? 'Correct' : 'Incorrect'}
        </div>
      )}
    </div>
  );
};

export default QuestionType1;
