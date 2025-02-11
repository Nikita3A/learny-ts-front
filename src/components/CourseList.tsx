import React from 'react';
import '../../src/scrollbar.css'; // Adjust the path according to your project structure

const CourseList = ({ courses, onAddCourse, onCourseSelect }) => (
  <div className="flex flex-col h-full">
    {/* Scrollable course list */}
    <div className="flex-grow overflow-y-auto px-4 py-2 space-y-2 scrollbar-hidden">
      {courses.map((course, index) => (
        <div
          key={index}
          className="flex items-center bg-darkGray rounded-lg p-2 text-white"
          onClick={() => onCourseSelect(course)}
        >
          <div className="flex-grow">
            <div className="text-lg font-semibold">{course.name}</div>
            <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green h-2.5 rounded-full"
                style={{ width: course.progress }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Sticky Add Course button */}
    <div className="px-4 py-2 bg-dark">
      <button
        className="w-full flex items-center justify-center bg-green text-white text-lg font-semibold rounded-lg py-2 border border-mediumGray"
        onClick={onAddCourse}
      >
        Add Course
      </button>
    </div>
  </div>
);

export default CourseList;
