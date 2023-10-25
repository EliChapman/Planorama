import './LoginPage.css';

import { NavLink, Navigate } from 'react-router-dom';
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import logoDark from '../../assets/logo-name-dark.svg'
import logoLight from '../../assets/logo-name-light.svg'
import useThemeValue from '../Hooks/useThemeValue';
import useToken from '../Hooks/useToken';

async function loginUser(credentials) {
  try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        // Handle server errors here, e.g., display an error message to the user
        return await { success: false, error: {code : response.status, message : await response.text()} };
      } else {
        return await { success: true, error: null, token: response.json() };
      }

  } catch (error) {
      console.error('Login error:', error);
      // Handle client-side errors, e.g., network issues or unexpected responses
  }
}


function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await loginUser({
      username,
      password
    });
    if (result.success) {
      setToken([username, await result.token]);
    } else {
      setErrorMessage(result.error.message)
    }
  }

  return(
    <div className="login-wrapper">
      <img src={useThemeValue() === 'dark' ? logoDark : logoLight} className='navbar-logo' alt="Planorama" />
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label className='login-section'>
          <p className='login-page-text'>Username</p>
          <input className='login-text-box' type="text" placeholder="Enter username" onChange={e => setUserName(e.target.value)} />
        </label>
        <label className='login-section'>
          <p className='login-page-text'>Password</p>
          <input className='login-text-box' type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div className='submit-section'>
          <button className='btn btn-primary' type="submit">Submit</button>
        </div>
      </form>
      <span className='login-error-message'>{errorMessage}</span>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};

const LoginPage = () => {
  const { token, setToken } = useToken();
  
  if (!token) {
    return (
      <div className='login-page'>
        <Login setToken={setToken} />
        <div className='login-register-wrapper'>
          <p className='login-page-text'>Don't have an account?</p>
          <NavLink className='login-register-btn btn btn-secondary' to='/register'> Register </NavLink>
        </div>
      </div>
    )
  } 
  else {
    return <Navigate to='/' replace={true} />
  }
}

export default LoginPage;