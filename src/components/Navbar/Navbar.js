import './Navbar.css'

import React, { useState } from 'react';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg'
import logoDark from '../../assets/logo-name-dark.svg'
import logoLight from '../../assets/logo-name-light.svg'
import { useAuth } from '../AuthContext/AuthContext';
import useWindowDimensions from '../Hooks/useWindowDimensions';

const ToggleTheme = (updateThemeState) => {
  let new_theme = ['dark', 'light'][(localStorage.getItem('theme') === 'dark' & 1)]

  localStorage.setItem('theme', new_theme)
  updateThemeState(new_theme)

  const event = new Event('themeChange');
  document.dispatchEvent(event);
}

const Navbar = () => {
  const [stateTheme, updateStateTheme] = useState(localStorage.getItem('theme'));

  const width = useWindowDimensions().width;

  const { user, login, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          {
            width <= 400 ? <img src={logo} className='navbar-logo-icon' alt='P'/> : <img src={stateTheme === 'dark' ? logoDark : logoLight} className='navbar-logo' alt="Planorama" />
          }
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/"> Home </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard"> Dashboard </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/about-us"> About Us </NavLink>
            </li> */}
          </ul>
        </div>
        {
          !!user ? (
            <NavLink className="navbar-login-btn btn btn-primary" to="/profile"> {user.username} </NavLink>
          ) : (
            <NavLink className="navbar-login-btn btn btn-primary" to="/login"> Login </NavLink>
          )
        }
        <button className="btn theme-toggle" type="button" onClick={() => ToggleTheme(updateStateTheme)}>
          <span>
            {
              stateTheme === 'light' ? 
              <FontAwesomeIcon icon={faMoon} /> : 
              <FontAwesomeIcon icon={faSun} />
            }
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;