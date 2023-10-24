import React from "react";

import { useState } from "react";
import { Modal } from "react-modal";

// Style for the modal
const customStyles = {
    content: {
      width: '300px',
      margin: 'auto',
    },
  };

function PasswordModal({ isOpen, onRequestClose, onDelete }) {
    const [password, setPassword] = useState('');
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleSubmit = () => {
      onDelete(password);
      onRequestClose();
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Password Modal"
      >
        <h2>Enter Your Password</h2>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </Modal>
    );
}

export default PasswordModal;