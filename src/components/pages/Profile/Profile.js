import './Profile.css'

import { NavLink, Navigate } from 'react-router-dom';
import React, { useState } from 'react';

import PasswordModal from '../../PasswordModal/PasswordModal';
import { useAuth } from '../../AuthContext/AuthContext';

function handleModal() {

}

const Profile = ()  => {
  const { user, login, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return(<Navigate to='/' replace={true} />)
  } else {
    return(
      <div className='profile-page'>
        <h2 className='profile-header'>Welcome, {user.username}!</h2>
        <button className='profile-btn btn btn-warning' onClick={logout}> Logout </button>
        <button className='profile-btn btn btn-danger' onClick={openModal}> Delete Account </button>
        <PasswordModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    );
  }
}

export default Profile;