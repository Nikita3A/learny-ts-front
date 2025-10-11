import React, { useEffect } from 'react';
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

    useEffect(() => {
        if (questions.length === 0) {
            generateTests(Number(lessonId));
        }
    }, [questions.length, generateTests, lessonId]);

    if (isGenerating) {
        return <div>Creating test questions...</div>;
    }

    console.log('Questions:', questions);

    return (
        <div>
            <QuestionType1 />
        </div>
    );
};

export default TestPage;
