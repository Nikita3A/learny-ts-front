import { useState, useEffect } from 'react';

interface Course {
  id: number;
  name: string;
  progress: string;
}

const useCourses = (accessToken: string | undefined) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!accessToken) {
        setCourses([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

    

      try {
        const response = await fetch("/api/courses/users", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });        

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }

        const serverCourses = await response.json();
        const transformedCourses = serverCourses.map((course: any) => ({
          id: course.id,
          name: course.theme,
          progress: "0%",
        }));

        setCourses(transformedCourses);
      } catch (fetchError) {
        console.error("Error fetching courses:", fetchError);
        setError(fetchError.message || "Failed to fetch courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [accessToken]);

  return { courses, isLoading, error };
};

export default useCourses;
