import { useState } from 'react';

const useGenerateTests = (lessonId: number) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTests = async (lessonId: number, accessToken: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/lessons/${lessonId}/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate tests');
      }

      return await response.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateTests, isGenerating, error };
};

export default useGenerateTests;
