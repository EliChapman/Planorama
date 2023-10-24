import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './components/AuthContext/AuthContext'

import Home from './components/pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import AboutUs from './components/pages/About Us/About Us';
import Dashboard from './components/pages/Dashboard/Dashboard';
import Profile from './components/pages/Profile/Profile';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

import useThemeValue from './components/Hooks/useThemeValue'

import './_content.scss';
import './App.css';

// Detect user default theme
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light');
}

const App = () => {
  

  return (
    <AuthProvider>
      <div className="App" data-bs-theme={ useThemeValue() }>
        <BrowserRouter >
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/about-us' element={<AboutUs />} />
            <Route exact path='/dashboard' element={<Dashboard />} />
            <Route exact path='/profile' element={<Profile />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route exact path='/register' element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
