import { useState, useEffect, useRef } from "react";
import Button from "../button/button";
import "./timer.css";

function Timer () {
  const [timeLeft, setTimeLeft] = useState(20 * 60); 
  const [isRunning, setisRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const seconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")};
  };


}