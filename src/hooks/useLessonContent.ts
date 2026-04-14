// src/hooks/useLessonContent.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UseLessonContentOptions {
  unitId: string;
  lessonId: string;
  accessToken: string;
}

export const useLessonContent = ({ unitId, lessonId, accessToken }: UseLessonContentOptions) => {
  const queryClient = useQueryClient();

  // Query for fetching lesson content
  const { data, isLoading, error } = useQuery({
    queryKey: ['lessonContent', unitId, lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/units/${unitId}/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.content || '';
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for generating content
  const { mutate: generateContent, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      // First make the PATCH request to generate content
      const generateResponse = await fetch(`/api/units/${unitId}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!generateResponse.ok) {
        throw new Error(`Failed to generate content: ${generateResponse.status}`);
      }

      // Then fetch the updated content
      const contentResponse = await fetch(`/api/units/${unitId}/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!contentResponse.ok) {
        throw new Error(`Failed to fetch updated content: ${contentResponse.status}`);
      }

      const result = await contentResponse.json();
      return result.content || '';
    },
    onSuccess: (newContent) => {
      // Update cache optimistically
      queryClient.setQueryData(['lessonContent', unitId, lessonId], newContent);
    },
    onError: (error) => {
      console.error('Error generating lesson content:', error);
      throw error;
    }
  });

  return {
    content: data,
    isLoading,
    error,
    isGenerating,
    generateContent
  };
};
export default useLessonContent;