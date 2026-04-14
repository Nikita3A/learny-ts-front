import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const useQuestions = (lessonId: number) => {
  const [questions, setQuestions] = useState([]);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`/api/lessons/${lessonId}/tests`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    loadQuestions();
  }, [currentUser]);

  return  questions;
};

export default useQuestions;