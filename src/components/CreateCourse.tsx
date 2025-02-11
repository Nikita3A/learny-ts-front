import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreateCourse = ({hideForm, loadCoursesList}) => {
  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [courseStructure, setCourseStructure] = useState("");
  // Access the current user's access token from Redux store
  const { currentUser } = useSelector((state) => state.user);

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
      // Make the POST request to create a new course
      const response = await axios.post("/api/courses/", courseData, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`, // Include access token in headers
        },
      });

      console.log("Course created successfully:", response.data);

      // Clear form inputs after successful submission
      setLanguage("");
      setTheme("");
      setTargetAudience("");
      setLearningObjectives("");
      setCourseStructure("");

      hideForm();
      loadCoursesList();

      // Optionally, notify the user or redirect them to another page
    } catch (error) {
      console.error("Error creating course:", error);
      hideForm();
      loadCoursesList();
      // Handle errors (e.g., show an error message to the user)
    }
  };

  return (
    <div className="overflow-x-hidden sm:overflow-visible p-6 bg-darkGray h-full w-full rounded-xl shadow-md space-y-4">
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
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none"
            placeholder="e.g., English"
            required
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
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none"
            placeholder="e.g., Introduction to Python Programming"
            required
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
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none"
            placeholder="e.g., Beginners, High School Students"
            required
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
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none"
            placeholder="e.g., By the end of this course, students should be able to..."
            rows="4"
            required
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
            className="w-full px-4 py-2 rounded-md bg-mediumGray text-white focus:outline-none"
            placeholder="e.g., 6 units with 4-5 chapters each..."
            rows="4"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green rounded-md text-white font-bold hover:bg-opacity-80 transition"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
