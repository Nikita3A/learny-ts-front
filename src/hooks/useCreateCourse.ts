// src/hooks/useCreateCourse.ts
import { useState } from 'react';

interface CreateCourseData {
  language: string;
  theme: string;
  targetAudience: string;
  learningObjectives: string;
  courseStructure: string;
}

const useCreateCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = async (courseData: CreateCourseData, accessToken: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      return await response.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCourse, isLoading, error };
};

export default useCreateCourse;
