import React from 'react';

const timeFormatter = (seconds) => {
    const leftMin = ~~(seconds/60);
    const leftSec = seconds%60;
    let str = '';
    if (leftMin) str+= `${leftMin}min `;
    if (leftSec) str+= `${leftSec}sec `;
    return str;
}

const Timer = ({ duration = 120, handleTimerEnd }) => {
  const [time, setTime] = React.useState(duration);
  let intervalId;

  React.useEffect(() => {

    intervalId = setInterval(() => {
        if (time) setTime((prev) => prev - 1);
    }, 1000);

    // Cleanup Code
    return () => {
        clearInterval(intervalId);
    }
  }, []);

  React.useEffect(() => {
    if (time <= 0) {
        clearInterval(intervalId);
        handleTimerEnd?.();
    }
  }, [time]);

  return (
    <div>{timeFormatter(time)}</div>
  )
}

export default Timer;