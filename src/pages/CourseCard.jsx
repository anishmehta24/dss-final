import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <img src='../public/code.jpg' alt={course.title} className="course-image" />
      <div className="course-details">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-rating">Rating: {course.rating} / 5</p>
        <p className="course-level">Level: {course.level}</p>
      </div>
    </div>
  );
};

export default CourseCard;
