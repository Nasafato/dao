import React, { useCallback, useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
  render?: (timeLeft: TimeLeft) => JSX.Element;
}

type TimeLeft = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function Countdown({ targetDate, ...props }: CountdownProps) {
  const calculateTimeLeft = useCallback(() => {
    let difference = +targetDate - +new Date();
    let timeLeft = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        years: Math.floor(difference / (1000 * 60 * 60 * 24 * 365)),
        months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [calculateTimeLeft]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const render = props.render ?? defaultRender;
  return render(timeLeft);
}

function defaultRender(timeLeft: TimeLeft) {
  const hours = timeLeft.hours.toString().padStart(2, "0");
  const minutes = timeLeft.minutes.toString().padStart(2, "0");
  const seconds = timeLeft.seconds.toString().padStart(2, "0");
  return (
    <div className="font-mono">
      {hours}h {minutes}m {seconds}seconds
    </div>
  );
}
