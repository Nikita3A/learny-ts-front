// src/pages/CourseCreationPage.tsx
import React, { useState } from 'react';
import CourseCreationForm from '../components/Courses/CourseCreationForm';
import AIAssistantChat from '../components/Courses/AIAssistantChat';
import { useNavigate } from 'react-router-dom';

const CourseCreationPage = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    // other fields as needed
  });
  const [activeComponent, setActiveComponent] = useState<'form' | 'chat'>('form');
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view
  useState(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (data) => {
    try {
      // Call your API to create the course
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newCourse = await response.json();
        navigate(`/courses/${newCourse.id}`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {isMobileView && (
        <div className="flex border-b border-mediumGray">
            <button
            onClick={() => setActiveComponent('form')}
            className={`flex-1 p-4 text-center font-medium transition-colors ${
                activeComponent === 'form'
                ? 'bg-darkGray text-white border-b-2 border-green'
                : 'bg-dark text-gray-400 hover:text-white'
            }`}
            >
            Course Form
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
        )}


      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {isMobileView ? (
          // Mobile view - show only one component
          activeComponent === 'form' ? (
            <div className="w-full p-4 overflow-y-auto">
              <CourseCreationForm
                initialData={courseData}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/courses')}
                onAIRequest={() => setActiveComponent('chat')}
              />
            </div>
          ) : (
            <div className="w-full p-4 overflow-y-auto">
              <AIAssistantChat
                courseData={courseData}
                onSuggestionAccept={(field, value) => {
                  setCourseData(prev => ({ ...prev, [field]: value }));
                }}
                onBack={() => setActiveComponent('form')}
              />
            </div>
          )
        ) : (
          // Desktop view - show both components
          <>
            <div className="w-2/3 p-4 overflow-y-auto border-r border-gray-700">
              <CourseCreationForm
                initialData={courseData}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/courses')}
                onAIRequest={() => setActiveComponent('chat')}
              />
            </div>
            <div className="w-1/3 bg-gray-800 overflow-hidden">
              <AIAssistantChat
                courseData={courseData}
                onSuggestionAccept={(field, value) => {
                  setCourseData(prev => ({ ...prev, [field]: value }));
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCreationPage;
