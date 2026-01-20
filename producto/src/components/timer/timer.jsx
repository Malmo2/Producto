import { useState, useEffect, useRef } from "react";
import Button from "../button/button";
import "./timer.css";

function Timer () {
  const [timeLeft, setTimeLeft] = useState(20 * 60); 
  const [isRunning, setisRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    
  }
}