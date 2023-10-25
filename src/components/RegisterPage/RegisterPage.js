import './RegisterPage.css'

import { NavLink, Navigate } from 'react-router-dom';
import React, { useState } from 'react';

import logoDark from '../../assets/logo-name-dark.svg'
import logoLight from '../../assets/logo-name-light.svg'
import { useAuth } from '../AuthContext/AuthContext';
import useThemeValue from '../Hooks/useThemeValue';

async function registerUser(credentials) {
    try {
        const response = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
    
        if (!response.ok) {
          // Handle server errors here, e.g., display an error message to the user
          return { success: false, error: {code : response.status, message : await response.text()} };
        }

        return { success: true, error: null };
    
    } catch (error) {
        console.error('Registration error:', error);
        // Handle client-side errors, e.g., network issues or unexpected responses
    }
}
   
function Register() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [result, setResult] = useState({success: null, message: null})
  
    const handleSubmit = async e => {
      e.preventDefault();
      const result = await registerUser({
        username,
        password
      });

      if (result.success) {
        setResult({success: true, message: 'Registered Successfully!'})
      } else {
        setResult({success: false, message: result.error.message})
      }
    }
   
    return(
      <div className="register-wrapper">
      <img src={useThemeValue() === 'dark' ? logoDark : logoLight} className='navbar-logo' alt="Planorama" />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label className='register-section'>
          <p className='register-page-text'>Username</p>
          <input className='register-text-box' type="text" placeholder="Enter username" onChange={e => setUserName(e.target.value)} />
        </label>
        <label className='register-section'>
          <p className='register-page-text'>Password</p>
          <input className='register-text-box' type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div className='submit-section'>
          <button className='btn btn-primary' type="submit">Submit</button>
        </div>
      </form>
      <span style={{color: result.success ? 'var(--bs-success)' : 'var(--bs-danger)'}} className='register-result-message'>{result.message}</span>
    </div>
    )
}

const RegisterPage = () => {
    const { user, login, logout } = useAuth();

    if (!user) {
        return (
          <div className='register-page'>
            <Register />
            <div className='register-login-wrapper'>
              <p className='register-page-text'>Already have an account?</p>
              <NavLink className='register-login-btn btn btn-secondary' to='/login'> Login </NavLink>
            </div>
        </div>
        )
      } 
      else {
        return <Navigate to='/' replace={true} />
      }
}
   
export default RegisterPage;