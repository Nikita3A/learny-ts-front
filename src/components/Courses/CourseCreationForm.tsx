import React, { useState } from "react";
import { useSelector } from "react-redux";
import useCreateCourse from '../../hooks/useCreateCourse';

const CreateCourse = ({ hideForm, loadCoursesList }) => {
  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [courseStructure, setCourseStructure] = useState("");

  // Access the current user's access token from Redux store
  const { currentUser } = useSelector((state) => state.user);
  const { createCourse, isLoading, error } = useCreateCourse();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      language,
      theme,
      targetAudience,
      learningObjectives,
      courseStructure,
    };

    try {
      // Use the custom hook to create the course
      await createCourse(courseData, currentUser.accessToken);

      // Clear form inputs after successful submission
      setLanguage("");
      setTheme("");
      setTargetAudience("");
      setLearningObjectives("");
      setCourseStructure("");

      // Refresh the course list and hide the form
      loadCoursesList();
      hideForm();
    } catch (error) {
      // Error is already handled by the hook
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="overflow-x-hidden sm:overflow-visible p-6 bg-darkGray h-full w-full rounded-xl shadow-md space-y-4">
      {error && (
        <div className="p-3 bg-red-500 text-white rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="language" className="block text-white mb-1">
            Language of the Course
          </label>
          <input
            type="text"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none focus:ring-2 focus:ring-green"
            placeholder="e.g., English"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="theme" className="block text-white mb-1">
            Theme or Subject
          </label>
          <input
            type="text"
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none focus:ring-2 focus:ring-green"
            placeholder="e.g., Introduction to Python Programming"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block text-white mb-1">
            Target Audience
          </label>
          <input
            type="text"
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none focus:ring-2 focus:ring-green"
            placeholder="e.g., Beginners, High School Students"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="learningObjectives" className="block text-white mb-1">
            Learning Objectives
          </label>
          <textarea
            id="learningObjectives"
            value={learningObjectives}
            onChange={(e) => setLearningObjectives(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none focus:ring-2 focus:ring-green"
            placeholder="e.g., By the end of this course, students should be able to..."
            rows="4"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        <div>
          <label htmlFor="courseStructure" className="block text-white mb-1">
            Course Structure
          </label>
          <textarea
            id="courseStructure"
            value={courseStructure}
            onChange={(e) => setCourseStructure(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none focus:ring-2 focus:ring-green"
            placeholder="e.g., 6 units with 4-5 chapters each..."
            rows="4"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-green rounded-md text-white font-bold transition ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-80'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Course...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
