import React from 'react';
import './CoursePage.css'; // Import the CSS file for styling


import RecommendShow from './RecommendShow';
const RecommendPage = () => {


  return (
    <div className="course-page">
      <nav className="navbar">
        <div className="navbar-left">
          Edtech
        </div>
        <div className="navbar-right">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div className="course-list">
        <h1>Available Courses</h1>
        <div className="courses-grid">
        <RecommendShow/>
        </div>
      
      </div>
    </div>
  );
};

export default RecommendPage;
