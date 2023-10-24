import React, { useState } from 'react';

import { useAuth } from '../AuthContext/AuthContext';
import { NavLink, Navigate } from 'react-router-dom';

import './RegisterPage.css'

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
          throw new Error(response.status + ': ' + await response.text());
        }
        console.log(response)
        const data = await response.json();
        // You can do something with the data, like redirect to a login page or show a success message to the user
    
    } catch (error) {
        console.error('Registration error:', error);
        // Handle client-side errors, e.g., network issues or unexpected responses
    }
}
   
function Register() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser({
            username,
            password,
        });
    }
   
    return(
        <div className="register-wrapper">
            <h1>Please Register</h1>
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

const RegisterPage = () => {
    const { user, login, logout } = useAuth();

    if (!user) {
        return (
          <div className='login-page'>
            <Register />
            <NavLink className='nav-link' to='/Login'> Login </NavLink>
          </div>
        )
      } 
      else {
        return <Navigate to='/' replace={true} />
      }
}
   
export default RegisterPage;