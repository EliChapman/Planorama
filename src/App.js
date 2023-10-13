import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './components/pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import AboutUs from './components/pages/About Us/About Us';

import './_content.scss';
import './App.css';


// Detect user default theme
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light');
}

const App = () => {
  const [themeValue, updateThemeValue] = useState(
    localStorage.getItem('theme')
  );

   useEffect(() => { 
    // Define a function to handle changes in localStorage
    const handleLocalStorageChange = (e) => {
      updateThemeValue(localStorage.getItem('theme')); // Update state when localStorage changes
    };

    // Listen for changes in localStorage
    document.addEventListener('themeChange', handleLocalStorageChange, false);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('themeChange', handleLocalStorageChange);
    };
  })

  return (
    <div className="App" data-bs-theme={ themeValue }>
      <BrowserRouter >
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/about-us' element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
