import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  }
  return (
    <div className="landing-page">
      <header className="header">
        <nav className="navbar">
          <div className="logo">MyWebsite</div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><button className="sign-up">Sign Up</button></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MyWebsite</h1>
          <p>Learn new skills and explore the world of knowledge.</p>
          <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className="hero-video">
          <video loop autoPlay>
            <source src="../public/lohp-hero-animation-dots.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Interactive Learning</h3>
            <p>Engage with interactive lessons and challenges.</p>
          </div>
          <div className="feature-item">
            <h3>Expert Instructors</h3>
            <p>Learn from top professionals in their fields.</p>
          </div>
          <div className="feature-item">
            <h3>Flexible Learning</h3>
            <p>Learn at your own pace, anytime, anywhere.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <h2>About Us</h2>
        <p>We are committed to providing the best learning experience.</p>
      </section>

      <footer id="contact" className="footer">
        <p>Contact us: email@example.com</p>
      </footer>
    </div>
  );
};

export default LandingPage;
