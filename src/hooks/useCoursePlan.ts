// src/hooks/useCoursePlan.ts
import { useState, useEffect } from 'react';

interface CourseUnit {
  id: string;
  title: string;
  completed: boolean;
  lessons: Array<{
    id: string;
    title: string;
    finished: boolean;
  }>;
}

interface UseCoursePlanOptions {
  courseId: string;
  accessToken: string;
}

export const useCoursePlan = ({ courseId, accessToken }: UseCoursePlanOptions) => {
  const [courseData, setCourseData] = useState<CourseUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data?.units && Array.isArray(data.units)) {
          setCourseData(data.units);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError(error instanceof Error ? error.message : 'Failed to load course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, accessToken]);

  return { courseData, isLoading, error };
};
