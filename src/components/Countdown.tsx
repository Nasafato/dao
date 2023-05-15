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
        days: Math.floor(difference / (1000 * 60 * 60 * 24)) % 30,
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
  const years = timeLeft.years.toString().padStart(2, "0");
  const months = timeLeft.months.toString().padStart(2, "0");
  const days = timeLeft.days.toString().padStart(2, "0");
  const hours = timeLeft.hours.toString().padStart(2, "0");
  const minutes = timeLeft.minutes.toString().padStart(2, "0");
  const seconds = timeLeft.seconds.toString().padStart(2, "0");
  const display = [];
  if (timeLeft.years > 0) display.push(`${years}y`);
  if (timeLeft.months > 0) display.push(`${months}mo`);
  if (timeLeft.days > 0) display.push(`${days}d`);
  if (timeLeft.hours > 0) display.push(`${hours}h`);
  if (timeLeft.minutes > 0) display.push(`${minutes}m`);
  if (timeLeft.seconds > 0) display.push(`${seconds}s`);
  if (display.length === 0) display.push("Now");

  return <div className="font-mono">{display.join(" ")}</div>;
}
