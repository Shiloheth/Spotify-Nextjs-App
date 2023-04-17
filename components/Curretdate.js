import React, { useState, useEffect } from 'react';

export default function CurrentDate(){
    const[currentDay,setCurrentDay] = useState(new Date().getDay())
    const[currentDate,setCurrentDate] = useState(new Date().getDate())
    const[currentMonth,setCurrentMonth] = useState(new Date().getMonth())
    const[currentYear,setCurrentYear] = useState(new Date().getFullYear())
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January",  "February",  "March",  "April", "May", "June",  "July",  "August",  "September",  "October",  "November",  "December"
      ];
      

    useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentDay(new Date().getDay());
          setCurrentMonth(new Date().getMonth());
          setCurrentYear(new Date().getFullYear());
          setCurrentDate(new Date().getDate())
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, []);

      return (
        <>
          <h1  className='date'>{daysOfWeek[currentDay]+' '+currentDate+' '+months[currentMonth]+ ' '+currentYear}</h1>
        </>
      );
}