import React from 'react';

import { useAuth } from '../../AuthContext/AuthContext';
import { NavLink, Navigate } from 'react-router-dom';

import './Profile.css'
import DeleteAccount from '../../DeleteAccount/DeleteAccount';

export default function Profile() {
  const { user, login, logout, deleteAccount } = useAuth();

  if (!user) {
    return(<Navigate to='/' replace={true} />)
  } else {
    return(
      <div className='profile-page'>
        <h2>Profile</h2>
        <button onClick={logout}> Logout </button>
        <button onClick={deleteAccount}> Delete Account </button>
        <DeleteAccount />
      </div>
    );
  }
}