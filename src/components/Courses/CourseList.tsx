import React, { useState, useEffect } from 'react';
import '../../scrollbar.css'; // Ensure this path is correct for your project
import { useSelector } from 'react-redux';

// --- Best Practice: Define expected shapes for complex props (especially with TypeScript) ---
// Example (if not using TypeScript, this is just for clarity):
// interface Course {
//   id: string | number;
//   name: string;
//   progress: string;
// }
// interface CurrentUser {
//   accessToken?: string;
// }
// interface CourseListProps {
//   currentUser: CurrentUser | null;
//   onCourseSelect: (course: Course) => void;
//   onAddCourse: () => void;
// }

// --- Component Definition ---
const CourseList = () => {
  // --- State Management ---
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // To store potential fetch errors
  const currentUser = useSelector((state) => state.user.currentUser);
  const onAddCourse = async () => {
    return 0;
  }

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Define the async function to load courses

    const loadCourses = async () => {
      // Check for user and token before attempting to fetch
      if (!currentUser?.accessToken) {
        // console.warn("No access token available. Cannot fetch courses.");
        setCourses([]); // Clear courses if user is not logged in or token is missing
        setError(null); // Clear any previous error
        setIsLoading(false);
        return;
      }

      setIsLoading(true); // Set loading state
      setError(null); // Clear previous errors

      try {
        // Use Fetch API
        const response = await fetch("/api/courses/users", {
          method: 'GET', // Optional: GET is the default
          headers: {
            // Set Authorization header for authentication
            'Authorization': `Bearer ${currentUser.accessToken}`,
            // Indicate expected content type (good practice)
            'Content-Type': 'application/json',
          },
        });

        // Check if the response status indicates success (e.g., 200 OK)
        if (!response.ok) {
          // Throw an error with the status text for better debugging
          throw new Error(`Network response was not ok: ${response.statusText} (Status: ${response.status})`);
        }

        // Parse the JSON response body
        const serverCourses = await response.json();

        // Transform the server's data to match the expected structure
        const transformedCourses = serverCourses.map((course) => ({
          id: course.id,          // Use the unique ID from the server
          name: course.theme,     // Use "theme" as the course name
          progress: "0%",         // Default progress value (adjust if API provides it)
        }));

        // Update the state with the fetched and transformed courses
        setCourses(transformedCourses);

      } catch (fetchError) {
        // Catch any errors during the fetch operation or processing
        console.error("Error fetching courses:", fetchError);
        setError(fetchError.message || "Failed to fetch courses. Please try again."); // Set error state for UI feedback
      } finally {
        // Always set loading to false after fetch attempt (success or failure)
        setIsLoading(false);
      }
    };

    // Call the function to load courses
    loadCourses();

    // --- Dependency Array ---
    // Re-run the effect if the currentUser object changes
  }, [currentUser]); // Re-fetch if the user context changes

  // --- Conditional Rendering ---
  if (isLoading) {
    return <div className="p-4 text-center text-white">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  // --- Render Course List ---
  return (
    <div className="flex flex-col h-full bg-dark"> {/* Added bg-dark here if needed for container */}
      {/* Scrollable course list */}
      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-2 scrollbar-hidden">
        {courses.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 py-4">No courses found.</div>
        )}
        {courses.map((course) => (
          <div
            key={course.id} // --- Best Practice: Use stable unique ID for key ---
            className="flex items-center bg-darkGray rounded-lg p-3 text-white cursor-pointer hover:bg-mediumGray transition-colors duration-150" // Added padding, cursor, hover effect
            onClick={() => onCourseSelect(course)}
            // --- Accessibility ---
            role="button" // Indicate it's clickable
            tabIndex={0} // Make it keyboard focusable
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCourseSelect(course); }} // Allow activation with Enter/Space
          >
            <div className="flex-grow">
              <div className="text-lg font-semibold mb-1">{course.name}</div> {/* Added margin-bottom */}
              {/* Progress Bar */}
              <div className="w-full bg-gray-500 rounded-full h-2 dark:bg-gray-700"> {/* Slightly darker background */}
                <div
                  className="bg-green h-2 rounded-full"
                  style={{ width: course.progress }} // Assumes progress is like '50%'
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Add Course button */}
      <div className="px-4 py-3 bg-dark border-t border-mediumGray"> {/* Adjusted padding and added border */}
        <button
          type="button" // --- Accessibility: Specify button type ---
          className="w-full flex items-center justify-center bg-green text-white text-lg font-semibold rounded-lg py-2 px-4 hover:bg-green-dark transition-colors duration-150" // Added padding, hover effect
          onClick={onAddCourse}
        >
          Add Course
        </button>
      </div>
    </div>
  );
};

export default CourseList;