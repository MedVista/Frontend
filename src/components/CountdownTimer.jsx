import { useState, useEffect } from "react";

const CountdownTimer = ({ minutes = 15 }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // แปลงนาทีเป็นวินาที

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // แปลงวินาทีเป็น MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="text-center mr-2">
      {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
