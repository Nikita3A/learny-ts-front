// src/pages/LessonPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LessonContent from '../components/Lessons/LessonContent';
import AIChat from '../components/AI/AIChat';

const LessonPage = () => {
  const params = useParams();
  const unitId = params.unitId ?? params.courseId ?? (params as any).course?.id;
  const lessonId = params.lessonId ?? params.id;

  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [activeComponent, setActiveComponent] = useState<'content' | 'chat'>('content');

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-full w-full bg-dark">
      {isMobileView ? (
        <div className="w-full flex flex-col">
          <div className="flex border-b border-mediumGray">
            <button
              onClick={() => setActiveComponent('content')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${
                activeComponent === 'content'
                  ? 'bg-darkGray text-white border-b-2 border-green'
                  : 'bg-dark text-gray-400 hover:text-white'
              }`}
            >
              Lesson
            </button>
            <button
              onClick={() => setActiveComponent('chat')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${
                activeComponent === 'chat'
                  ? 'bg-darkGray text-white border-b-2 border-green'
                  : 'bg-dark text-gray-400 hover:text-white'
              }`}
            >
              AI Assistant
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeComponent === 'content' ? (
              <div className="w-full h-full overflow-y-auto p-4">
                <LessonContent unitId={unitId} lessonId={lessonId} />
              </div>
            ) : (
              <div className="w-full h-full p-4 overflow-y-auto">
                <AIChat unitId={unitId} lessonId={lessonId} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="w-2/3 h-full overflow-y-auto p-4">
            <LessonContent unitId={unitId} lessonId={lessonId} />
          </div>
          <div className="w-1/3 h-full border-l border-mediumGray">
            <AIChat unitId={unitId} lessonId={lessonId} />
          </div>
        </>
      )}
    </div>
  );
};

export default LessonPage;
