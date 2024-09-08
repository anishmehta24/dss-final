import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';
import './CourseShow.css';

const CourseShow = ({ selectedLevel }) => {
  const [courses, setCourses] = useState([]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Replace the URL with your API endpoint
        const response = await axios.get('http://127.0.0.1:5000/courses');
        console.log(response)
        const updatedCourses = response.data.map((course) => ({
          ...course,
          level: "Beginner", // Set the level of each course to the selected level
        }));
        setCourses(updatedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [selectedLevel]);

  return (
    <div className="courses-grid">
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default CourseShow;
