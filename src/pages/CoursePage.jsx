import React from 'react';
import './CoursePage.css'; // Import the CSS file for styling
import CourseShow from './CourseShow';

  import { useNavigate } from 'react-router-dom';



const CoursePage = () => {

  const navigate = useNavigate();
  const handleRecommend = async () => {    
            navigate('/recommend');   
      };

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
         <CourseShow/>
        </div>
        <button
        className="continue-button"
        onClick={handleRecommend}
      
      >
        Recommend course based on your previous performances
      </button>
      </div>
    </div>
  );
};

export default CoursePage;
