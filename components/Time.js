import React, { useState, useEffect } from 'react';

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <h1 className='time'>{currentTime}</h1>
    </>
  );
}

export default Clock;
