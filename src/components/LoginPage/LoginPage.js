import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useToken from '../Hooks/useToken';

import './LoginPage.css';

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
        throw new Error(response.status + ': ' + await response.text());
      } else {
        return await response.json();
      }

  } catch (error) {
      console.error('Login error:', error);
      // Handle client-side errors, e.g., network issues or unexpected responses
  }
}

function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    if (!!token) {
      setToken([username, token]);
    }
  }

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
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
        <NavLink className='nav-link' to='/register'> Register </NavLink>
      </div>
    )
  } 
  else {
    return <Navigate to='/' replace={true} />
  }
}

export default LoginPage;