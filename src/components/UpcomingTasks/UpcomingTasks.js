import './UpcomingTasks.css'

import { useAuth } from '../AuthContext/AuthContext';
import { useState } from 'react';

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

async function updateEvent(username, eventName, eventDate, completed) {
    const url = 'http://localhost:8080/update-event';
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, eventName, eventDate, completed }),
      });
  
      if (!response.ok) {
        // Handle errors based on the response status
        const errorMessage = await response.text();
        throw new Error(`${response.status} - ${errorMessage}`);
      }
  
      return 'Event completed status updated successfully';
    } catch (error) {
      console.error('Error updating event:', error);
      // Handle the error as needed
      return 'Failed to update event completed status';
    }
}

const UpcomingTasks = () => {
    const {user, login, logout} = useAuth()
    const [eventsToRender, setEventsToRender] = useState([])
    const [completedEventsToRender, setCompletedEventsToRender] = useState([])

    const handleEventClick = async (e) => {
        const eventName = e.target.getAttribute('data-name');
        const eventDate = e.target.getAttribute('data-date');
        const eventComplete = e.target.getAttribute('data-completed');
        await updateEvent(user.username, eventName, eventDate, !eventComplete)
      };

    const handleEventRefresh = async (e) => {
        const events = await getEvents(user.username, user.token)
  
        var eventsList = []
        var completedList = []
  
        if (!!events) {
          for (const event of events) {
            const eventTime = new Date(event.date)
            const todayTime = new Date()

            const daysUntilTarget = Math.ceil((eventTime - todayTime) / (1000 * 60 * 60 * 24));

            if (event.completed == 'false' || !event.completed) {
                if (daysUntilTarget <= 5 && daysUntilTarget >= 0) {

                    eventsList.push(
                        <div 
                            className='upcoming-event not-completed'
                            onClick={handleEventClick}
                            data-name={event.name}
                            data-date={event.date}
                            data-completed={false}
                        >
                            {`${new Date(event.date).getDate()}${new Date(event.date).getDate() == 1 ? 'st' : new Date(event.date).getDate() == 2 ? 'nd' : new Date(event.date).getDate() == 3 ? 'rd' : 'th'}, ${new Date(event.date).getHours()}:${new Date(event.date).getMinutes().toString().padStart(2, '0')} : ${event.name}`}
                        </div>
                    )
                }
            } else if (event.completed == 'true') {
                if (daysUntilTarget >= -5 && daysUntilTarget <= 1) {

                    completedList.push(
                        <div 
                            className='upcoming-event completed' 
                            onClick={handleEventClick}
                            data-name={event.name}
                            data-date={event.date}
                            data-completed={true}
                        >
                            {`${new Date(event.date).getDate()}${new Date(event.date).getDate() == 1 ? 'st' : new Date(event.date).getDate() == 2 ? 'nd' : new Date(event.date).getDate() == 3 ? 'rd' : 'th'}, ${new Date(event.date).getHours()}:${new Date(event.date).getMinutes().toString().padStart(2, '0')} : ${event.name}`}
                        </div>
                    )
                }
            }
          }
          setEventsToRender(eventsList)
          setCompletedEventsToRender(completedList)
       }
      }

    return (
        <div className='upcoming-tasks-container'>
            <button className='upcoming-refresh btn btn-primary' onClick={handleEventRefresh}> Refresh Upcoming</button>
            <div className='task-wrapper'>
                <div className='done upcoming-tasks-section'>
                    <h2 className='todo-header'> Recently Completed </h2>
                    {completedEventsToRender.length > 0 ? completedEventsToRender : 'No recently completed tasks'}
                </div>
                <div className='todo upcoming-tasks-section'>
                    <h2 className='todo-header'> Upcoming Tasks </h2>
                    {eventsToRender.length > 0 ? eventsToRender : 'No tasks within 5 days!'}
                </div>
            </div>

        </div>
    )
}

export default UpcomingTasks;