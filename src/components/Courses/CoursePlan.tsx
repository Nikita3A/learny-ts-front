import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import LessonContent from '../LessonContent';
import { useCoursePlan } from '../../hooks/useCoursePlan';
// import Test from '../Test';

const CoursePlan = ({ courseId, selectedLesson, setSelectedLesson }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testData, setTestData] = useState([]);

  const { courseData, isLoading, error } = useCoursePlan({
    courseId,
    accessToken: currentUser?.accessToken
  });

  const onAddUnit = () => {
    // Logic to add a new unit
    console.log('Add Unit clicked');
  }

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  // ... rest of your methods (handleTestClick, handleTestFinish) ...

return (
    <div className="flex flex-col h-full bg-dark">
      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-2 scrollbar-hidden">
        {/* Course header */}
        <div className="bg-darkGray rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Course Plan</h2>
            <button
              onClick={onAddUnit}
              className="flex items-center bg-green hover:bg-opacity-80 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <span className="mr-2">+</span> Add Unit
            </button>
          </div>

          {isTakingTest ? (
            <Test testData={testData} handleTestFinish={handleTestFinish} />
          ) : (
            <>
              {selectedLesson ? (
                <div className="bg-darkGray rounded-lg p-4">
                  <LessonContent
                    unitId={courseData.find(unit =>
                      unit.lessons?.some(lesson => lesson.id === selectedLesson.id)
                    )?.id}
                    lessonData={selectedLesson}
                  />
                </div>
              ) : (
                courseData.length > 0 ? (
                  courseData.map((section, index) => (
                    <div key={index} className="course-section mb-2 text-white">
                      <div
                        className="cursor-pointer flex items-center justify-between py-3 px-4 bg-dark rounded-lg hover:bg-mediumGray transition-colors duration-200"
                        onClick={() => toggleSection(index)}
                      >
                        <h3 className={`font-bold text-lg ${section.completed ? 'text-green' : 'text-white'}`}>
                          {section.title}
                        </h3>
                        <span className="text-sm text-gray-300">
                          {section.lessons?.length || 0} lessons
                        </span>
                      </div>
                      {expandedSection === index && section.lessons?.length > 0 && (
                        <div className="section-content mt-1 text-white bg-dark p-4 rounded-lg">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className={`flex items-center p-2 rounded-md ${lessonIndex === section.lessons.length - 1 ? '' : 'mb-2'} hover:bg-mediumGray transition-colors duration-200`}
                              onClick={() => handleLessonClick(lesson)}
                            >
                              <p className={`text-md flex-1 cursor-pointer ${lesson.finished ? 'text-green' : 'text-white'}`}>
                                {lesson.title}
                              </p>
                              <div
                                className="cursor-pointer p-1 rounded-full hover:bg-opacity-50 transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTestClick(lesson.id);
                                }}
                              >
                                <img
                                  src="/test.png"
                                  alt="Test icon"
                                  className={`ml-2 w-5 h-5 ${lesson.finished ? 'opacity-50' : 'opacity-100'}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {expandedSection === index && (!section.lessons || section.lessons.length === 0) && (
                        <div className="section-content mt-1 text-white bg-dark p-4 rounded-lg">
                          <p>No lessons in this section.</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    {courseData.length === 0 && courseId ? (
                      <div>
                        <p className="mb-4">Loading course data...</p>
                        <button
                          onClick={onAddUnit}
                          className="bg-green hover:bg-opacity-80 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          Add First Unit
                        </button>
                      </div>
                    ) : "No courses available."}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlan;
