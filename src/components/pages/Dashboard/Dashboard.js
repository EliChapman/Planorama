import './Dashboard.css'

import React, { useState } from 'react';

import Calendar from '../../Calendar/Calendar'
import UpcomingTasks from '../../UpcomingTasks/UpcomingTasks';
import { useAuth } from '../../AuthContext/AuthContext';

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

async function removeEvent(username, eventName, eventDate) {
  try {
      const response = await fetch('http://localhost:8080/remove-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, 
          eventName: eventName,
          eventDate: eventDate
        }),
      });
  
      if (!response.ok) {
        // Handle server errors here, e.g., display an error message to the user
        throw new Error(response.status + ': ' + await response.text());
      }
      console.log(response)
      const data = await response.json();
  
  } catch (error) {
      console.error('Error deleting event:', error);
      // Handle client-side errors, e.g., network issues or unexpected responses
  }
}

async function getEvents(username, token) {
  try {
      const response = await fetch(`http://localhost:8080/get-user-events?username=${username}&token=${token}`, {
        method: 'GET'
      });
  
      if (!response.ok) {
        // Handle server errors here, e.g., display an error message to the user
        throw new Error(response.status + ': ' + await response.text());
      }

      const data = await response.json();
      return data
  
  } catch (error) {
      console.error('Error deleting event:', error);
      // Handle client-side errors, e.g., network issues or unexpected responses
  }
}


const testEvent = {
  "name": "Test",
  "date": new Date('December 17, 1995 03:24:00').toISOString(),
  "description": "test-description",
  "imageFilename": "Test" + new Date('December 17, 1995 03:24:00').toISOString(),
}

export default function Dashboard() {
  const {user, login, logout} = useAuth()

  const [eventImage, setEventImage] = useState()
  const [selectedFile, setSelectedFile] = useState()

  const handleSubmit = (e) => {
    e.preventDefault()
    setEventImage(selectedFile)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Store the selected file in state or a variable

    setSelectedFile(selectedFile);
  };

  const handleClickedAdd = async (e) => {
    console.log(eventImage)
    const result = await addEvent(user.username, testEvent, eventImage);
    console.log(result)
  }

  const handleClickedRemove = async (e) => {
    const result = await removeEvent(user.username, "Test", new Date('December 17, 1995 03:24:00').toISOString());
    console.log(result)
  }

  const handleClickedGet = async (e) => {
    const result = await getEvents(user.username, user.token);
    console.log(result)
  }

  return(
    <div className='dashboard-page'>
      <h2 className='dashboard-heading'>Dashboard</h2>
      {/* <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      <button className='btn btn-primary' onClick={handleClickedAdd}>Add Test Event</button>
      <button className='btn btn-primary' onClick={handleClickedRemove}>Remove Test Event</button>
      <button className='btn btn-primary' onClick={handleClickedGet}>Get Events</button> */}
      <UpcomingTasks />
      <Calendar />
    </div>
  );
}