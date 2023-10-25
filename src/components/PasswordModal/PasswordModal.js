import './PasswordModal.css'

import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext/AuthContext';

async function deleteUser(credentials) {
    try {
        const response = await fetch('http://localhost:8080/delete-account', {
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
    
    } catch (error) {
        console.error('Deletion error:', error);
        // Handle client-side errors, e.g., network issues or unexpected responses
    }
}

const PasswordModal = ({ isOpen, onClose }) => {
    const {user, login, logout} = useAuth()

    const [password, setPassword] = useState('');
    const username = user.username

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };

    function handleModalClose() {
        setPassword('');
        onClose();
    };

    async function handleSubmit(e) {
        e.preventDefault() // Prevents the page refresh that <form /> elements trigger

        await deleteUser({
            username,
            password
        });

        logout()
    };

    return (
        <div className='password-modal' hidden={!isOpen}>
        <div className="password-modal-content">
            <span className="close-button" onClick={handleModalClose}>
            <FontAwesomeIcon icon={faClose} />
            </span>
            <h2 className='password-modal-header' >Password Required</h2>
            <form className='password-modal-form' onSubmit={handleSubmit}>
                <label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </label>
                <div>
                    <button className='password-modal-submit-button btn btn-danger' type="submit">Delete!</button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default PasswordModal;