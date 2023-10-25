import './Calendar.css';

import React, { useEffect, useState } from 'react';

import CalendarModal from '../CalendarModal/CalendarModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext/AuthContext';

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

const Calendar = () => {
  const {user, login, logout} = useAuth()
  const [eventsToRender, setEventsToRender] = useState([])

  // Modal Stuff
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(new Date(1, 1, 1))
  };


  function daysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
  }

  // Cool hover effect that took too long
  const handleMouseMoveGrid = (e) => {
    for (const card of document.getElementsByClassName('calendar-date')) {
      const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`)
    }
  }

  const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const [selected_day, setSelectedDay] = useState(new Date(1, 1, 1))
    
    const updateMonth = (offset) => {
      setMonth(month + offset)
      if (month >= 12) {
        setMonth(0 + (offset - 1))
        setYear(year + 1)
      } else if (month < 0) {
        setMonth(11 + (offset + 1))
        setYear(year - 1)
      }
    }

    useEffect(() => {
      handleEventRefresh()
    }, [month]);

    const selectDay = (key) => {
      key = key.split(" ")
      const identifier = key[0]
      const num = parseInt(key[1])
      
      if (identifier === "past") {
        updateMonth(-1)
      }
      else if (identifier === "day") {
        setSelectedDay(new Date(year, month, num))
        openModal()
      }
      else if (identifier === "future") {
        updateMonth(1)
      } else if (identifier === "selected") {
        setSelectedDay(new Date(1, 1, 1))
      }
    }

    var base_day = new Date(year, month, 1)

    // Get day list for calendar
    var days = []
    var preview_days = []
    var running = true
    var total_days = 0
    var day_index;

    for (var i = 0; i < base_day.getDay(); i++) {
      day_index = daysInMonth(base_day.getMonth(), base_day.getFullYear()) - base_day.getDay() + i + 1
      preview_days.push(day_index)
      days.push(
        <div 
          className='day-preview calendar-date' 
          key = {"past " + day_index} 
          day-key = {"past " + day_index} 
          onClick={(props) => selectDay(props.target.getAttribute("day-key"))}
        >
          <div className='calendar-date-content'>
            {day_index}
          </div>
        </div>
      )
      total_days += 1
    }

    day_index = 1

    while (running) {
        if (day_index >= daysInMonth(base_day.getMonth() + 1, base_day.getFullYear())) {
            running = false
        }
        if (day_index === selected_day.getDate() && base_day.getMonth() === selected_day.getMonth() && base_day.getFullYear() === selected_day.getFullYear()) {
          days.push(
            <div 
              className='date-entry calendar-date' 
              key = {"day " + day_index} 
              day-key = {"selected " + day_index} 
              id = "selected-day"
              onClick={(props) => selectDay(props.target.getAttribute("day-key"))}
            >
              <div className='calendar-date-content'>
                {day_index}
              </div>
          </div>
          )
        } else {
          days.push(
            <div 
              className='date-entry calendar-date'
              key = {"day " + day_index} 
              day-key = {"day " + day_index} 
              onClick={(props) => selectDay(props.target.getAttribute("day-key"))}
            >
              <div className='calendar-date-content'>
                {day_index}
              </div>
            </div>
          )
        }
        day_index += 1
    }

    day_index += -1
    total_days += day_index
    day_index = 1

    while (total_days % 7 !== 0) {
      preview_days.push(day_index)
      days.push(
        <div 
          className='day-preview calendar-date' 
          key = {"future " + day_index} 
          day-key = {"future " + day_index} 
          onClick={(props) => selectDay(props.target.getAttribute("day-key"))}
        >
          <div className='calendar-date-content'>
            {day_index}
          </div>
        </div>
      )
      day_index += 1
      total_days += 1
    }

    const handleEventRefresh = async (e) => {
      const events = await getEvents(user.username, user.token)

      var eventsList = []

      if (!!events) {
        for (const event of events) {
          const eventDate = new Date(event.date)
          if (eventDate.getFullYear() == year) {
            if (eventDate.getMonth() == (month > 1 ? month - 1 : 12)) {
              if (preview_days.includes(eventDate.getDate())) {
                eventsList.push(
                  {
                    preview : true,
                    date : eventDate,
                    name : event.name,
                    desc : event.desc,
                    imgFilename : event.imageFilename,
                    completed : event.completed,
                  }
                )
              }
            } else if (eventDate.getMonth() == month) {
              eventsList.push(
                {
                  preview : false,
                  date : eventDate,
                  name : event.name,
                  desc : event.desc,
                  imgFilename : event.imageFilename,
                  completed : event.completed,
                }
              )

            } else if (eventDate.getMonth() == (month < 12 ? month + 1 : 1)) {
              if (preview_days.includes(eventDate.getDate())) {
                eventsList.push(
                  {
                    preview : true,
                    date : eventDate,
                    name : event.name,
                    desc : event.desc,
                    imgFilename : event.imageFilename,
                    completed : event.completed,
                  }
                )
              }
            }
          }
        }
        setEventsToRender(eventsList)
     }
    }

    function test(e) {
      e.stopPropagation()
      console.log('test')
    }

    var daysBeingRendered = []
    var content

    for (var i = 0; i < days.length; i++) {
      content = []
      const dayType = days[i].key.split(' ')[0]
      const dayIndex = days[i].key.split(' ')[1]
      
      for (const event of eventsToRender) {
        if (new Date(event.date).getDate() == dayIndex ) {
          if ((dayType == 'day' && !event.preview)) {
            content.push(
              <div className={'event' + (event.completed == 'true' ? ' completed' : ' not-completed')} onClick={test}>
                {`${new Date(event.date).getHours()}:${new Date(event.date).getMinutes().toString().padStart(2, '0')} : ${event.name}`}
              </div>
            )
          }
          else if (dayType != 'day' && event.preview) {
            content.push(
              <div className={'event' + (event.completed == 'true' ? ' completed' : ' not-completed')}>
                {`${new Date(event.date).getHours()}:${new Date(event.date).getMinutes().toString().padStart(2, '0')} : ${event.name}`}
              </div>
            )
          }
        }
      }
      daysBeingRendered.push(
        <div key={days[i].key} day-key={days[i].key} className={days[i].props['className']} onClick={days[i].props['onClick']}>
          <div className='calendar-date-content'>
            <span className='date-number'>{dayIndex}</span>
            {content}
          </div>
        </div>
      )
    }

    // Return Calendar
    return (
        <div className="calendar-container">
          <CalendarModal isOpen={isModalOpen} onClose={closeModal} date={selected_day} />
          <div className="calendar-header">
            <FontAwesomeIcon icon={faCircleChevronLeft} className='calendar-button' onClick={() => updateMonth(-1)} />
            <h2 id="calendar-header">{base_day.toLocaleString('default', { month: 'long' })} {base_day.getFullYear()}</h2>
            <FontAwesomeIcon icon={faCircleChevronRight} className='calendar-button' onClick={() => updateMonth(1)} />
          </div>

          <div className="calendar-grid" onMouseMove={handleMouseMoveGrid}>
            <div className='weekday-name' key={"sunday"}>
              <abbr title="S">Sunday</abbr>
            </div>
            <div className='weekday-name' key={"monday"}>
              <abbr title="M">Monday</abbr>
            </div>
            <div className='weekday-name' key={"tuesday"}>
              <abbr title="T">Tuesday</abbr>
            </div>
            <div className='weekday-name' key={"wednesday"}>
              <abbr title="W">Wednesday</abbr>
            </div>
            <div className='weekday-name' key={"thursday"}>
              <abbr title="T">Thursday</abbr>
            </div>
            <div className='weekday-name' key={"friday"}>
              <abbr title="F">Friday</abbr>
            </div>
            <div className='weekday-name' key={"saturday"}>
              <abbr title="S">Saturday</abbr>
            </div>
            {daysBeingRendered}
          </div>
          <button className='refresh-btn btn btn-primary' onClick={handleEventRefresh}> Refresh </button>
        </div>
    )
}
export default Calendar;
