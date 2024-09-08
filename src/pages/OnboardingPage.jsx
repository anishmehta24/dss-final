import React, { useState } from 'react';
import './OnboardingPage.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const OnboardingPage = () => {
  const [step, setStep] = useState(1); // Tracks the current step (1: topics, 2: level, 3: learning preference, 4: learning goal)
  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic name for step 1
  const [selectedLevel, setSelectedLevel] = useState(null); // Selected level name for step 2
  const [selectedPreference, setSelectedPreference] = useState(null); // Selected learning preference name for step 3
  const [selectedGoal, setSelectedGoal] = useState(null); // Selected learning goal name for step 4
  const navigate = useNavigate(); 

  const handleContinue = async () => {
    if (step === 1 && selectedTopic !== null) {
      setStep(2);
    } else if (step === 2 && selectedLevel !== null) {
      setStep(3);
    } else if (step === 3 && selectedPreference !== null) {
      setStep(4);
    } else if (step === 4 && selectedGoal !== null) {
      // Save the data to the database
      const data = {
        topic: selectedTopic,
        level: selectedLevel,
        learning_preference: selectedPreference,
        learning_goal: selectedGoal
      };

      try {
        const response = await axios.post('http://127.0.0.1:5000/signup', data, {
          headers: {
            'Content-Type': 'application/json',
            // You can add more custom headers if needed
          },
        });
        console.log('Preferences saved successfully');
        navigate('/courses'); 
      } catch (error) {
        console.error('Error saving preferences', error);
      }
    }
  };

  const topics = [
    
    { id: 1, name: 'Finance Management', description: 'Learn to be fianancially independent' },
    { id: 2, name: 'SQL', description: 'SQL is a standardized language used to manage and manipulate relational databases.' },
    { id: 3, name: 'Programming', description: 'Learn to code with Python, Java, C++ and more.' },
    { id: 4, name: 'AR/VR', description: 'Unleash your creativity with Augmented reality and Virtual Reality.' },
  ];

  const levels = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Intermediate' },
    { id: 3, name: 'Advanced' }
  ];

  const learningPreferences = [
    { id: 1, name: 'Visual' },
    { id: 2, name: 'Auditory' },
    { id: 3, name: 'Kinesthetic' }
  ];

  const learningGoals = [
    { id: 1, name: 'Improve Skills' },
    { id: 2, name: 'Career Advancement' },
    { id: 3, name: 'Learn New Concepts' },
    { id: 4, name: 'Complete Certification' }
  ];

  const handleTopicClick = (name) => {
    setSelectedTopic(name); // Set the selected topic name
  };

  const handleLevelClick = (name) => {
    setSelectedLevel(name); // Set the selected level name
  };

  const handlePreferenceClick = (name) => {
    setSelectedPreference(name); // Set the selected learning preference name
  };

  const handleGoalClick = (name) => {
    setSelectedGoal(name); // Set the selected learning goal name
  };

  return (
    <div className="onboarding-page">
      {step === 1 && (
        <>
          <h1>Welcome! Let's Get Started</h1>
          <p>Select the topic that interests you:</p>
          <div className="topics-grid">
            {topics.map(topic => (
              <div
                key={topic.id}
                className={`topic-card ${selectedTopic === topic.name ? 'selected' : ''}`}
                onClick={() => handleTopicClick(topic.name)}
              >
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1>Select Your Level</h1>
          <p>Choose your current proficiency level:</p>
          <div className="topics-grid">
            {levels.map(level => (
              <div
                key={level.id}
                className={`topic-card ${selectedLevel === level.name ? 'selected' : ''}`}
                onClick={() => handleLevelClick(level.name)}
              >
                <h3>{level.name}</h3>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1>Select Your Learning Preference</h1>
          <p>How do you prefer to learn?</p>
          <div className="topics-grid">
            {learningPreferences.map(pref => (
              <div
                key={pref.id}
                className={`topic-card ${selectedPreference === pref.name ? 'selected' : ''}`}
                onClick={() => handlePreferenceClick(pref.name)}
              >
                <h3>{pref.name}</h3>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h1>Select Your Learning Goal</h1>
          <p>What is your primary learning goal?</p>
          <div className="topics-grid">
            {learningGoals.map(goal => (
              <div
                key={goal.id}
                className={`topic-card ${selectedGoal === goal.name ? 'selected' : ''}`}
                onClick={() => handleGoalClick(goal.name)}
              >
                <h3>{goal.name}</h3>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        className="continue-button"
        onClick={handleContinue}
        disabled={
          (step === 1 && selectedTopic === null) ||
          (step === 2 && selectedLevel === null) ||
          (step === 3 && selectedPreference === null) ||
          (step === 4 && selectedGoal === null)
        }
      >
        Continue
      </button>
    </div>
  );
};

export default OnboardingPage;
