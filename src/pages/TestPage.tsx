import React, { useEffect, useState } from 'react';
import QuestionType1 from '../components/Questions/QuestionType1';
import QuestionType2 from '../components/Questions/QuestionType2';
import QuestionType3 from '../components/Questions/QuestionType3';
import { useParams } from 'react-router-dom';
import useQuestions from '../hooks/useQuestions';
import useGenerateTests from '../hooks/useGenerateTests';
import ProgressBar from '../components/Questions/ProgressBar';

const TestPage = () => {
  const { lessonId } = useParams();
  const { questions } = useQuestions(Number(lessonId));
  const { generateTests, isGenerating } = useGenerateTests(Number(lessonId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  const handleSelectAnswer = (option: string, correctAnswer: string) => {
    setSelectedAnswer(option);
    setIsAnswerCorrect(option === correctAnswer);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleProgress = (index) => {
    setCurrentQuestionIndex(index);
  };

  useEffect(() => {
    if (!questions || questions.length === 0) {
      generateTests(Number(lessonId));
    }
  }, [questions, generateTests, lessonId]);

  if (isGenerating) {
    return <div>Creating test questions...</div>;
  }

  // console.log('Questions:', questions);

  return (
    <div>
      {/* {console.log('Questions length:', questions?.length)} */}

      {!questions || questions.length === 0 ? (
        <div>No questions available.</div>
      ) : (
        <div className="mt-8 mx-auto flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center mb-4 mt-4">
            {questions.map((question, index) => (
              <div
                onClick={() => handleProgress(index)}
                className={
                  currentQuestionIndex === index
                    ? 'bg-green mr-3 p-1 px-4 rounded-md'
                    : 'bg-mediumGray mr-3 p-1 px-4 rounded-md'
                }
              >
                {index + 1}
              </div>
            ))}
          </div>
          {/* <ProgressBar currentQuestionIndex={currentQuestionIndex} totalQuestions={questions.length} /> */}
          {questions[currentQuestionIndex].type === 'single' ? (
            // console.log('asnwer page', questions[currentQuestionIndex].correctAnswer),
            <QuestionType1
              key={currentQuestionIndex}
              selected={selectedAnswer}
              question={questions[currentQuestionIndex].questionText}
              options={questions[currentQuestionIndex].options}
              correctAnswer={questions[currentQuestionIndex].correctAnswer}
              onNext={handleNextQuestion}
              isAnswerCorrect={isAnswerCorrect}
              handleSelect={handleSelectAnswer}
            />
          ) : (
            <QuestionType2
              key={currentQuestionIndex}
              question={questions[currentQuestionIndex].questionText}
              options={questions[currentQuestionIndex].options}
              correctAnswer={questions[currentQuestionIndex].correctAnswer}
              onNext={handleNextQuestion}
            />
          )}
          <button className="bg-green text-white p-2 rounded-lg" onClick={handleNextQuestion}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TestPage;
