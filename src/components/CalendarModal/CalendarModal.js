import './CalendarModal.css'

import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext/AuthContext';

async function addEvent(username, event) {
    try {
        const response = await fetch('http://localhost:8080/add-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username, 
            event: event
          }),
        });
    
        if (!response.ok) {
          // Handle server errors here, e.g., display an error message to the user
          throw new Error(response.status + ': ' + await response.text());
        }
        console.log(response)
        const data = await response.json();
    
    } catch (error) {
        console.error('Error adding event:', error);
        // Handle client-side errors, e.g., network issues or unexpected responses
    }
}

const CalendarModal = ({ isOpen, onClose, date }) => {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [isValidTime, setIsValidTime] = useState(null);
    const [desc, setDesc] = useState('');
    const {user, login, logout} = useAuth();

    const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

    function handleTitleChange(e) {
        setTitle(e.target.value);
    };

    const handleTimeChange = (e) => {
        const inputValue = e.target.value;
        const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        // Check if the input is empty or matches the pattern
        if (inputValue === '' || timePattern.test(inputValue)) {
          setIsValidTime(true);
          setTime(inputValue);
        } else {
          setIsValidTime(false);
          setTime(inputValue)
        }
    };

    function handleDescChange(e) {
        setDesc(e.target.value);
    };


    function handleModalClose() {
        setTitle('');
        onClose();
    };

    async function handleSubmit(e) {
        e.preventDefault() // Prevents the page refresh that <form /> elements trigger

        if (!!isValidTime) {
            // Access the form element from the event
            const form = e.target;

            // Access form elements by their indexes
            const title = form[0].value
            const time = form[1].value.split(':')
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            const desc = form[2].value

            setTitle('')
            setTime('')
            setIsValidTime(null)
            setDesc('')

            const newEvent = {
                'name': title,
                'date': date,
                'description': desc,
                'imageFilename': title + date.toISOString()
            }

            await addEvent(user.username, newEvent)
            onClose()
        } else {
            alert('Enter a valid time!')
        }
    };
    
    return (
        <div className='calendar-modal' hidden={!isOpen}>
        <div className="calendar-modal-content">
            <span className="close-button" onClick={handleModalClose}>
            <FontAwesomeIcon icon={faClose} />
            </span>
            <h2 className='calendar-modal-header' >Create New Task</h2>
            <form className='calendar-modal-form' onSubmit={handleSubmit}>
                <label className='calendal-modal-section'>
                    <p>
                        Title: <input
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </p>
                </label>
                <label className='calendal-modal-section'>
                    <p>
                        Date: <span className='complete-info'>{`${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</span>
                    </p>
                </label>
                <label className='calendal-modal-section'>
                    <p>
                        Time:
                        <input
                            type="text"
                            placeholder="Enter time (hh:mm)"
                            value={time}
                            onChange={handleTimeChange}
                            style={{ borderColor: isValidTime ? 'initial' : 'var(--bs-danger)' }}
                        />
                    </p>
                    {!isValidTime && <p className='calendar-modal-error'>Invalid time format (hh:mm).</p>}
                </label>
                <label className='calendal-modal-section'>
                    <p>
                        Description: <input
                            type="text"
                            placeholder="Enter Description"
                            value={desc}
                            onChange={handleDescChange}
                        />
                    </p>
                </label>
                <div>
                    <button className='calendar-modal-submit-button btn btn-primary' type="submit">Create!</button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default CalendarModal;