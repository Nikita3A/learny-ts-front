import React, { useEffect, useState } from 'react';
import QuestionType1 from '../components/Questions/QuestionType1';
import QuestionType2 from '../components/Questions/QuestionType2';
import QuestionType3 from '../components/Questions/QuestionType3';
import ProgressBar from '../components/Questions/ProgressBar';
import { useParams } from 'react-router-dom';
import useQuestions from '../hooks/useQuestions';
import useGenerateTests from '../hooks/useGenerateTests';

const TestPage = () => {
  const { lessonId } = useParams();
  const { questions } = useQuestions(Number(lessonId));
  const { generateTests, isGenerating } = useGenerateTests(Number(lessonId));

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selections, setSelections] = useState<(string | null)[]>([]);
  const [statuses, setStatuses] = useState<('unanswered' | 'correct' | 'wrong')[]>([]);

  // initialize arrays when questions arrive / change
  useEffect(() => {
    const len = questions?.length ?? 0;
    setSelections((prev) => {
      const next = Array(len).fill(null);
      for (let i = 0; i < Math.min(prev.length, len); i++) next[i] = prev[i];
      return next;
    });
    setStatuses((prev) => {
      const next = Array(len).fill('unanswered' as const);
      for (let i = 0; i < Math.min(prev.length, len); i++) next[i] = prev[i];
      return next;
    });
    setCurrentQuestionIndex((ci) => Math.min(ci, Math.max(0, len - 1)));
  }, [questions]);

  // trigger generation if nothing available
  useEffect(() => {
    if (!questions || questions.length === 0) {
      generateTests(Number(lessonId));
    }
  }, [questions, generateTests, lessonId]);

  if (isGenerating && (!questions || questions.length === 0)) {
    return <div className="p-4 text-center">Creating test questions...</div>;
  }
  if (!questions || questions.length === 0) {
    return <div className="p-4 text-center">No questions available.</div>;
  }

  const handleSelectAnswer = (index: number, option: string) => {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = option;
      return next;
    });

    const correct = questions[index]?.correctAnswer;
    const isCorrect = Array.isArray(correct)
      ? String(correct[0]) === String(option)
      : String(correct) === String(option);

    setStatuses((prev) => {
      const next = [...prev];
      next[index] = isCorrect ? 'correct' : 'wrong';
      return next;
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleProgress = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // layout: single centered wrapper constrains everything for consistent alignment
  return (
    <div className="mt-8 flex justify-center px-4">
      <div className="w-full max-w-screen-md">
        {/* Use shared ProgressBar (squares centered; count placed without shifting squares) */}
        <div className="my-4">
          <ProgressBar
            total={questions.length}
            currentIndex={currentQuestionIndex}
            statuses={statuses}
            onJump={handleProgress}
          />
        </div>

        {/* Question card area constrained to a comfortable column */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-xl">
            {questions[currentQuestionIndex].type === 'single' ? (
              <QuestionType1
                question={questions[currentQuestionIndex].questionText}
                options={questions[currentQuestionIndex].options}
                selected={selections[currentQuestionIndex] ?? null}
                correctAnswer={questions[currentQuestionIndex].correctAnswer}
                isAnswerCorrect={
                  statuses[currentQuestionIndex] === 'correct'
                    ? true
                    : statuses[currentQuestionIndex] === 'wrong'
                      ? false
                      : null
                }
                handleSelect={(option: string) => handleSelectAnswer(currentQuestionIndex, option)}
              />
            ) : questions[currentQuestionIndex].type === 'multiple' ? (
              <QuestionType2
                key={currentQuestionIndex}
                question={questions[currentQuestionIndex].questionText}
                options={questions[currentQuestionIndex].options}
                correctAnswers={
                  Array.isArray(questions[currentQuestionIndex].correctAnswer)
                    ? questions[currentQuestionIndex].correctAnswer
                    : [String(questions[currentQuestionIndex].correctAnswer ?? '')]
                }
                selected={selections[currentQuestionIndex] ? [selections[currentQuestionIndex] as string] : []}
                onAnswer={(vals: string[]) => {
                  // for multiple, treat first selected as stored selection for compatibility
                  setSelections((prev) => {
                    const next = [...prev];
                    next[currentQuestionIndex] = vals.length > 0 ? vals[0] : null;
                    return next;
                  });
                  // simple evaluation: compare sets
                  const correct = Array.isArray(questions[currentQuestionIndex].correctAnswer)
                    ? (questions[currentQuestionIndex].correctAnswer as string[]).map(String)
                    : [String(questions[currentQuestionIndex].correctAnswer ?? '')];
                  const given = vals.map(String);
                  const ok =
                    correct.length > 0 && correct.length === given.length && correct.every((c) => given.includes(c));
                  setStatuses((prev) => {
                    const next = [...prev];
                    next[currentQuestionIndex] = ok ? 'correct' : 'wrong';
                    return next;
                  });
                }}
              />
            ) : (
              <QuestionType3
                question={questions[currentQuestionIndex].questionText}
                correctAnswer={String(questions[currentQuestionIndex].correctAnswer ?? '')}
                selected={selections[currentQuestionIndex] ?? ''}
                onAnswer={(val: string) => {
                  setSelections((prev) => {
                    const next = [...prev];
                    next[currentQuestionIndex] = val;
                    return next;
                  });
                  const correct = String(questions[currentQuestionIndex].correctAnswer ?? '')
                    .trim()
                    .toLowerCase();
                  const given = String(val ?? '')
                    .trim()
                    .toLowerCase();
                  const ok =
                    correct !== '' && (given === correct || given.includes(correct) || correct.includes(given));
                  setStatuses((prev) => {
                    const next = [...prev];
                    next[currentQuestionIndex] = ok ? 'correct' : 'wrong';
                    return next;
                  });
                }}
              />
            )}
          </div>
        </div>

        {/* Centered action buttons */}
        <div className="mt-4 flex gap-2 justify-center">
          <button className="bg-green text-white p-2 rounded-lg" onClick={handleNextQuestion}>
            Next
          </button>
          <button
            className="bg-mediumGray text-white p-2 rounded-lg"
            onClick={() => {
              console.log('All answers:', { selections, statuses, questions });
            }}
          >
            Analyze All (log)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
