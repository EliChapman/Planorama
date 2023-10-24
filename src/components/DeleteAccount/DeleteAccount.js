import React from "react";

import PasswordModal from "../PasswordModal/PasswordModal";
import { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";

import './DeleteAccount.css'

async function deleteUser(credentials) {
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
        console.error('Deletion error:', error);
        // Handle client-side errors, e.g., network issues or unexpected responses
    }
}

function DeleteAccount() {
    const { user, login, logout } = useAuth();

    // Modal Logic
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal is initially open
    const [isDeleting, setIsDeleting] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Deletion Logic
    const username = user?.username
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        await deleteUser({
            username,
            password,
        });
        setIsDeleting(false);
    }

    // HTML stuff
    return(
        <div>
            <button onClick={openModal}>Open Delete Account Modal</button>
            <PasswordModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                onSubmit={onSubmit}
            />
            {isDeleting && <div>Deleting your account...</div>}
        </div>
        // <div className="delete-wrapper" isOpen={isModalOpen} onRequestClose={closeModal} onSubmit={handleSubmit}>
        //     <h1>Please Enter Your Password to Continue</h1>
        //     <form onSubmit={handleSubmit}>
        //     <label>
        //         <p>Password</p>
        //         <input type="password" onChange={e => setPassword(e.target.value)} />
        //     </label>
        //     <div>
        //         <button type="submit">Submit</button>
        //     </div>
        //     </form>
        // </div>
    )
}

export default DeleteAccount;