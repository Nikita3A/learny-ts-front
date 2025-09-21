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

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  // ... rest of your methods (handleTestClick, handleTestFinish) ...

  return (
    <div className="p-0 sm:p-5 bg-darkGray h-full w-full rounded-2xl flex flex-col">
      {isTakingTest ? (
        <Test testData={testData} handleTestFinish={handleTestFinish} />
      ) : (
        <>
          <div className="scrollbar-hidden overflow-y-auto flex-grow h-full">
            {selectedLesson ? (
              <LessonContent
                unitId={courseData.find(unit => unit.lessons?.some(lesson => lesson.id === selectedLesson.id))?.id}
                lessonData={selectedLesson}
              />
            ) : (
              courseData.length > 0 ? (
                courseData.map((section, index) => (
                  <div key={index} className="course-section mb-2 text-white">
                    <div
                      className="section-header cursor-pointer flex items-center justify-between py-2 px-4 bg-dark rounded-md hover:bg-mediumGray transition"
                      onClick={() => toggleSection(index)}
                    >
                      <h3 className={`section-title font-bold text-lg ${section.completed ? 'text-green' : 'text-white'}`}>
                        {section.title}
                      </h3>
                    </div>
                    {expandedSection === index && section.lessons?.length > 0 && (
                      <div className="section-content mt-0 text-white bg-dark p-4 rounded-md">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className={`unit-item flex items-center py-2 ${lessonIndex === section.lessons.length - 1 ? '' : 'border-b border-mediumGray'}`}
                            onClick={() => handleLessonClick(lesson)}
                          >
                            <p className={`unit-title text-md flex-1 cursor-pointer ${lesson.finished ? 'text-green' : 'text-white'}`}>
                              {lesson.title}
                            </p>
                            <div className="cursor-pointer" onClick={(e) => {
                              e.stopPropagation();
                              handleTestClick(lesson.id);
                            }}>
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
                      <div className="section-content mt-0 text-white bg-dark p-4 rounded-md">
                        <p>No lessons in this section.</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-white text-center mt-4">
                  {courseData.length === 0 ? "Loading course data..." : "No courses available."}
                </p>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CoursePlan;
