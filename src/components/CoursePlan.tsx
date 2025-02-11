import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import LessonContent from './LessonContent';
import Test from './Test';

const CoursePlan = ({ course, selectedLesson, setSelectedLesson }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [courseData, setCourseData] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/api/courses/${course.id}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` }
        });

        if (response.data && response.data.units && Array.isArray(response.data.units)) {
          setCourseData(response.data.units);
        } else {
          console.error("Invalid data format from API:", response.data);
          setCourseData([]);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData([]);
      }
    };
    if (course?.id && currentUser?.accessToken) {
      fetchCourseData();
    } else {
      console.log("Course or user data not available yet.");
    }
  }, [course, currentUser?.accessToken]);

  const toggleSection = (index) => {    
    setExpandedSection(expandedSection === index ? null : index);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson) => {    
    setSelectedLesson(lesson);
  };

  const handleTestClick = async (lessonId) => {
    try {
      // Attempt to fetch the test
      const response = await axios.get(`/api/lessons/${lessonId}/tests`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });
  
      if (response.data?.test?.questions) {
        console.log("Fetched test data:", response.data);
  
        // Map the questions to match the structure expected by the Test component
        const formattedTestData = response.data.test.questions.map((question) => ({
          question: question.questionText, // Map questionText to question
          options: question.options,      // Options are already in array format
          correctAnswer: question.correctAnswer, // Map correctAnswer directly
          type: question.type,            // Map type directly
        }));
  
        setTestData(formattedTestData);
        setIsTakingTest(true);
      } else {
        console.error("No questions found in fetched test data.");
        setTestData([]);
        setIsTakingTest(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`No test found for lesson ${lessonId}. Generating a new test.`);
  
        try {
          // Generate a new test
          const generateResponse = await axios.post(
            `/api/lessons/${lessonId}/tests`,
            {}, // Pass an empty body if no specific data is required
            {
              headers: { Authorization: `Bearer ${currentUser.accessToken}` },
            }
          );
  
          if (generateResponse.data?.test?.questions) {
            console.log("Generated test data:", generateResponse.data);
  
            // Map the generated test data to match the expected format
            const formattedTestData = generateResponse.data.test.questions.map((question) => ({
              question: question.questionText,
              options: question.options,
              correctAnswer: question.correctAnswer,
              type: question.type,
            }));
  
            setTestData(formattedTestData);
            setIsTakingTest(true);
          } else {
            console.error("Generated test returned no data.");
            setTestData([]);
          }
        } catch (generateError) {
          console.error(`Error generating test for lesson ${lessonId}:`, generateError);
          setTestData([]);
          setIsTakingTest(false);
        }
      } else {
        console.error(`Error fetching test for lesson ${lessonId}:`, error);
        setTestData([]);
        setIsTakingTest(false);
      }
    }
  };
  
  
  

  const handleTestFinish = () => {
    setIsTakingTest(false);
  };

  // console.log("Course Data Before Render:", courseData);

  return (
    <div className="p-0 sm:p-5 bg-darkGray h-full w-full rounded-2xl flex flex-col">
      {isTakingTest ? (
        <Test testData={testData} handleTestFinish={handleTestFinish} />
      ) : (
        <>
          <div className="scrollbar-hidden overflow-y-auto flex-grow h-full">
            {selectedLesson ? (
              <LessonContent unitId={courseData.find(unit => unit.lessons.some(lesson => lesson.id === selectedLesson.id))?.id} 
              lessonData={selectedLesson}/>
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
                    {expandedSection === index && section.lessons && section.lessons.length > 0 && (
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
                                e.stopPropagation(); // Prevent lesson click when clicking test icon
                                handleTestClick(lesson.id);
                              }}>
                                <img src="./test.png" alt="Test icon" className={`ml-2 w-5 h-5 ${lesson.finished ? 'opacity-50' : 'opacity-100'}`} />
                              </div>
                            )
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
                  {courseData.length === 0 && currentUser?.accessToken && course?.id ? "Loading course data..." : "No courses available."}
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