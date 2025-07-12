import React, { useState } from 'react';
import QuestionType1 from './QuestionType1';
import QuestionType2 from './QuestionType2';
import QuestionType3 from './QuestionType3';

const Test = ({ testData, handleTestFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = testData[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Test finished
      handleTestFinish();
    }
  };

  const renderQuestionComponent = () => {
    if (!currentQuestion) return <p>Loading...</p>;
    console.log('cure: ', currentQuestion);
    
    switch (currentQuestion.type) {
      case "single":
        return (
          <QuestionType1
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
          />
        );
      case "multiple":
        return (
          <QuestionType2
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswers={currentQuestion.correctAnswers}
          />
        );
      case "text":
        return (
          <QuestionType3
            question={currentQuestion.question}
            correctAnswer={currentQuestion.correctAnswer}
          />
        );
      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div className="p-4 pt-20 sm:pt-4 h-full w-full flex flex-col self-center">
      <div className="">{renderQuestionComponent()}</div>
      <button
        className="mt-4 bg-green text-white py-2 px-4 rounded-xl"
        onClick={handleNextQuestion}
      >
        {currentQuestionIndex < testData.length - 1 ? 'Next' : 'Finish Test'}
      </button>
    </div>
  );

};

export default Test;
