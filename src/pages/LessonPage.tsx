// src/pages/LessonPage.tsx
import { useParams } from 'react-router-dom';
import LessonContent from '../components/Lessons/LessonContent';
import AIChat from '../components/AI/AIChat';

const LessonPage = () => {
  // read both possible param names and fall back so unitId isn't undefined
  const params = useParams();
  const unitId = params.unitId ?? params.courseId ?? params.course?.id;
  const lessonId = params.lessonId ?? params.id;

  console.log('LessonPage params:', { rawParams: params, unitId, lessonId });

  return (
    <div className="flex h-full w-full bg-dark">
      {/* Lesson content - 2/3 width */}
      <div className="w-2/3 h-full overflow-y-auto p-4">
        <LessonContent
          unitId={unitId}
          lessonId={lessonId}
        />
      </div>

      {/* AI Chat - 1/3 width */}
      <div className="w-1/3 h-full border-l border-mediumGray">
        <AIChat
          unitId={unitId}
          lessonId={lessonId}
        />
      </div>
    </div>
  );
};

export default LessonPage;
