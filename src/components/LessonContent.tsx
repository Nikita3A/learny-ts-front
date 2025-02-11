import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector

const LessonContent = ({ unitId, lessonData }) => {
  const { currentUser } = useSelector((state) => state.user); // Get currentUser from Redux
  const [lessonContent, setLessonContent] = useState(lessonData.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/units/${unitId}/lessons/${lessonData.id}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` }, // Add authorization header
        });
        setLessonContent(response.data.content || '');
      } catch (error) {
        console.error('Error fetching lesson content:', error);
        setError('Failed to load lesson content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!lessonData.content) {
      fetchLessonContent();
    }
  }, [unitId, lessonData.id, currentUser.accessToken]); // Add currentUser.accessToken to dependency array

  const handleGenerateContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch(`/api/units/${unitId}/lessons/${lessonData.id}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` }, // Add authorization header
      });

      const updatedLesson = await axios.get(`/api/units/${unitId}/lessons/${lessonData.id}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` }, // Add authorization header
      });

      setLessonContent(updatedLesson.data.content || '');
    } catch (error) {
      console.error('Error generating lesson content:', error);
      setError('Failed to generate lesson content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full scrollbar-hidden overflow-y-auto bg-darkGray rounded-lg relative w-full flex flex-col">
      <h2 className="text-xl text-white font-bold mb-2">{lessonData.title}</h2>
      <div className="flex-grow text-white mb-4">
        {isLoading ? (
          <p>Loading lesson content...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : lessonContent ? (
          <p>{lessonContent}</p>
        ) : (
          <p className="text-gray-500">
            No content available.
            <button className="ml-2 text-blue-500 underline" onClick={handleGenerateContent}>
              Generate Content
            </button>
          </p>
        )}
      </div>
      <div className="page-count text-right text-white">
        {lessonData.pageCount ? (
          <span>{lessonData.pageCount} pages</span>
        ) : (
          <span>Page count not available</span>
        )}
      </div>
    </div>
  );
};

export default LessonContent;