import React from 'react';
import CourseList from '../components/Courses/CourseList';

const CoursesPage = () => {
  // You can add hooks/data fetching here later
  return (
    <div>
      <h1>Courses</h1>
      <CourseList courses={[]} onAddCourse={() => {}} onCourseSelect={() => {}} />
    </div>
  );
};

export default CoursesPage;
