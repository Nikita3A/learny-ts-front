import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseList from '../components/Courses//CourseList';
import CoursePlan from '../components/Courses/CoursePlan';
import { useSelector } from 'react-redux';
import useCourses from '../hooks/useCourses';

const CoursesPage = () => {
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showCourseList, setShowCourseList] = useState(true);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);

  // Mobile view detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset view when courseId changes
  useEffect(() => {
    if (!courseId) {
      setShowCourseList(true);
    }
  }, [courseId]);

  // Placeholder data
  const isLoading = false;
  const error = null;
  const courses = [
    { id: 1, name: 'Sample Course', progress: '50%' },
    { id: 2, name: 'Another Course', progress: '30%' },
    { id: 3, name: 'Very Long Course Name That Might Take Multiple Lines', progress: '70%' },
    { id: 4, name: 'Another Sample', progress: '40%' },
    { id: 5, name: 'Yet Another Course', progress: '60%' },
    { id: 6, name: 'Final Course', progress: '80%' },
    { id: 7, name: 'Extra Course', progress: '20%' },
    { id: 8, name: 'Additional Course', progress: '90%' },
    { id: 8, name: 'Additional Course', progress: '90%' },
    { id: 8, name: 'Additional Course', progress: '90%' },
    { id: 8, name: 'Additional Course', progress: '90%' },
  ];
  const selectedCourse = courses.find((course) => String(course.id) === courseId);

  const handleCourseSelect = (course) => {
    if (isMobileView) {
      setShowCourseList(false);
    }
    navigate(`/courses/${course.id}`);
  };

  const handleBackToCourseList = () => {
    setShowCourseList(true);
    navigate('/courses');
  };

  const handleAddCourse = () => {
    setIsAddCourseModalOpen(true);
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <div className="text-lg text-white">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <div className="text-red-500 text-lg">Error loading courses: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-screen bg-dark overflow-hidden">
      {/* Left sidebar - course list */}
      {(showCourseList || !isMobileView) && (
        <div
          className={`${isMobileView ? 'w-full' : 'w-1/4'} h-full flex flex-col`}
          style={{ maxHeight: '100vh' }}
        >
          <CourseList
            courses={courses}
            onCourseSelect={handleCourseSelect}
            onAddCourse={handleAddCourse}
          />
        </div>
      )}

      {/* Right panel - course details */}
      {!isMobileView || !showCourseList ? (
        <div
          className={`${isMobileView ? 'w-full' : 'w-3/4'} h-full overflow-hidden`}
          style={{ maxHeight: '100vh' }}
        >
          {courseId && selectedCourse ? (
            <div className="h-full overflow-y-auto">
              <CoursePlan
                course={selectedCourse}
                onBack={isMobileView ? handleBackToCourseList : undefined}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              {isMobileView ? (
                <div className="p-4 text-center">
                  <p className="mb-2 text-white">Select a course from the list</p>
                  <button
                    onClick={handleBackToCourseList}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Back to Courses
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-white">
                  Select a course from the left panel to view its details
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CoursesPage;
