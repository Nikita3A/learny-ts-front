import React from 'react';
import '../../scrollbar.css';

const CourseList = ({ courses, onAddCourse, onCourseSelect }) => {
  return (
    <div className="flex flex-col h-full bg-dark">
      {/* Scrollable course list - takes all available space except button */}
      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-2 scrollbar-hidden">
        {courses.length === 0 ? (
          <div className="text-center text-gray-400 py-4">No courses found.</div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center bg-darkGray rounded-lg p-2 text-white cursor-pointer hover:bg-mediumGray transition-colors duration-150"
              onClick={() => onCourseSelect(course)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCourseSelect(course); }}
            >
              <div className="flex-grow">
                <div className="text-lg font-semibold mb-1">{course.name}</div>
                <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-green h-2.5 rounded-full"
                    style={{ width: course.progress }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Add Course button - takes only the space it needs */}
      <div className="px-4 py-2 bg-dark shrink-0">
        <button
          className="w-full flex items-center justify-center bg-green text-white text-lg font-semibold rounded-lg py-2 border border-mediumGray hover:bg-green-dark transition-colors duration-150"
          onClick={onAddCourse}
        >
          Add Course
        </button>
      </div>
    </div>
  );
};

export default CourseList;
