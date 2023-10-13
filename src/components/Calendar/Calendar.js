import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {

  // Generating Grid
  const rows = 4;
  const cols = 7;
  
  const squares = Array(rows * cols).fill(null).map((_, index) => {
    return (
      <div 
        className="square glow"
        key={index}  
      >
      </div>
    )
  })

  return (
    <div className="grid">
      {squares}
    </div>
  );
}

export default Calendar;
