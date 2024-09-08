import { useState } from 'react'
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css'


import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import CoursePage from './pages/CoursePage';
import RecommendPage from './pages/RecomendPage';
function App() {



  const router = createBrowserRouter([
    // { path: '/', element: <F12Main /> },
    { path: '/LandingPage', element: <LandingPage /> },
    { path: '/Onboarding', element: <OnboardingPage/> },
    { path: '/courses', element: <CoursePage/> },
    { path: '/recommend', element: <RecommendPage/> },


  ]);
  return (
    <RouterProvider router={router} />
  );
}

export default App
