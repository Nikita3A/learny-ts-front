// src/components/Lessons/LessonContent.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useLessonContent } from '../../hooks/useLessonContent';
import { ErrorBoundary } from 'react-error-boundary';

interface LessonContentProps {
  unitId: string;
  lessonId: string;
}

const LessonContent = ({ unitId, lessonId }: LessonContentProps) => {
  console.log('Rendering LessonContent for unitId:', unitId, 'lessonId:', lessonId);

  const { currentUser } = useSelector((state) => state.user);

  // call hook once, keep full result for logging and map `content` -> `lessonContent`
  const hookResult = useLessonContent({
    unitId,
    lessonId,
    accessToken: currentUser?.accessToken
  });

  const {
    lessonData,
    content: lessonContent,
    isLoading,
    isGenerating,
    error,
    generateContent
  } = hookResult;

  console.log('lessonContent rawdata:', hookResult);
  console.log('LessonContent hook data:', { lessonData, isLoading, isGenerating, error });

  return (
    <ErrorBoundary fallback={<div>Error loading lesson content</div>}>
      <div className="p-4 h-full scrollbar-hidden overflow-y-auto bg-darkGray rounded-lg relative w-full flex flex-col">
        <h2 className="text-xl text-white font-bold mb-2">{lessonData?.title || 'Lesson'}</h2>

        <div className="flex-grow text-white mb-4 space-y-4">
          {isLoading || isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse">Loading lesson content...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-900/20 rounded">
              {error instanceof Error ? error.message : 'Failed to load lesson content'}
            </div>
          ) : lessonContent ? (
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-line">{String(lessonContent)}</p>
            </div>
          ) : (
            <div className="text-gray-400 p-4 bg-blue-900/20 rounded">
              <p>No content available for this lesson.</p>
              <button
                onClick={() => generateContent && generateContent()}
                className="mt-2 text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : (
                  <>
                    <span className="mr-1">🤖</span> Generate Content with AI
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="page-count text-right text-gray-400 text-sm">
          {lessonData?.pageCount ? (
            <span>{lessonData.pageCount} page{lessonData.pageCount !== 1 ? 's' : ''}</span>
          ) : (
            <span>Page count not available</span>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LessonContent;
