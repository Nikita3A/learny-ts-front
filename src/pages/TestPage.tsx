import React, { useEffect, useState } from 'react';
import QuestionType1 from '../components/Questions/QuestionType1';
import QuestionType2 from '../components/Questions/QuestionType2';
import QuestionType3 from '../components/Questions/QuestionType3';
import { useParams } from 'react-router-dom';
import useQuestions from '../hooks/useQuestions';
import useGenerateTests from '../hooks/useGenerateTests';

const TestPage = () => {
  const { lessonId } = useParams();
  const { questions } = useQuestions(Number(lessonId));
  const { generateTests, isGenerating } = useGenerateTests(Number(lessonId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  console.log('Questions:', questions);

  return (
    <div>
      {console.log('Questions length:', questions?.length)}

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
          {questions[currentQuestionIndex].type === 'single' ? (
            <QuestionType1
              key={currentQuestionIndex}
              question={questions[currentQuestionIndex].questionText}
              options={questions[currentQuestionIndex].options}
              correctAnswer={questions[currentQuestionIndex].correctAnswer}
              onNext={handleNextQuestion}
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
          <button className="bg-green text-white p-2 rounded-lg w-full" onClick={handleNextQuestion}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TestPage;
