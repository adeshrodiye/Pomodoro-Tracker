import { useState, useEffect, useRef } from 'react';
import './App.css';

// DeepFocus Pomodoro Timer App
function App() {
  // State for timer functionality
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default: 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState(25); // Default input value: 25 minutes
  const [breakTime, setBreakTime] = useState(5); // Default break time: 5 minutes
  const [initialTime, setInitialTime] = useState(25 * 60); // Keep track of starting time
  const [initialBreakTime, setInitialBreakTime] = useState(5 * 60); // Keep track of starting break time
  const [darkMode, setDarkMode] = useState(false); // Theme state
  const [isBreak, setIsBreak] = useState(false); // Track if we're in break mode
  
  // Ref to store interval ID
  const intervalRef = useRef(null);
  
  // Handle timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      // Switch between focus and break modes
      if (isBreak) {
        // Break finished, switch to focus mode
        setIsBreak(false);
        setTimeLeft(initialTime);
      } else {
        // Focus finished, switch to break mode
        setIsBreak(true);
        setTimeLeft(initialBreakTime);
      }
    }
    
    // Cleanup function to clear interval
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, isBreak, initialTime, initialBreakTime]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle start/pause button
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Handle reset button
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(initialTime);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  // Handle custom time input
  const handleCustomTimeChange = (e) => {
    const value = parseInt(e.target.value) || 1; // Default to 1 min if invalid
    setCustomTime(value);
  };
  
  // Handle break time input
  const handleBreakTimeChange = (e) => {
    const value = parseInt(e.target.value) || 1; // Default to 1 min if invalid
    setBreakTime(value);
  };
  
  // Apply custom time settings
  const applyCustomTime = () => {
    const newTime = Math.max(1, customTime) * 60; // Ensure at least 1 minute
    setInitialTime(newTime);
    
    // Only update current time if we're in focus mode
    if (!isBreak) {
      setTimeLeft(newTime);
    }
    
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  // Apply break time settings
  const applyBreakTime = () => {
    const newBreakTime = Math.max(1, breakTime) * 60; // Ensure at least 1 minute
    setInitialBreakTime(newBreakTime);
    
    // Only update current time if we're in break mode
    if (isBreak) {
      setTimeLeft(newBreakTime);
    }
    
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Switch between focus and break modes
  const switchMode = () => {
    setIsActive(false);
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? initialTime : initialBreakTime);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="pomodoro-card">
        {/* Header with centered title and theme toggle button */}
        <div className="header">
          {/* Spacer to balance the layout */}
          <div className="spacer"></div>
          
          {/* Centered title */}
          <h1 className={`app-title ${darkMode ? 'dark-title' : 'light-title'}`}>
            DeepFocus
          </h1>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className={`theme-toggle ${darkMode ? 'dark-toggle' : 'light-toggle'}`}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mode Indicator */}
        <div className="mode-indicator">
          <span className={`mode-badge ${isBreak ? 'break-mode' : 'focus-mode'}`}>
            {isBreak ? 'Break Time' : 'Focus Time'}
          </span>
        </div>
        
        {/* Timer Display */}
        <div className={`timer-display ${darkMode ? 'dark-timer' : 'light-timer'}`}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Timer Controls */}
        <div className="timer-controls">
          <button
            onClick={toggleTimer}
            className={`control-button ${isActive ? 'pause-button' : 'start-button'}`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={resetTimer}
            className={`control-button reset-button ${darkMode ? 'dark-reset' : 'light-reset'}`}
          >
            Reset
          </button>
          
          <button
            onClick={switchMode}
            className={`control-button ${isBreak ? 'to-focus-button' : 'to-break-button'}`}
          >
            {isBreak ? 'Switch to Focus' : 'Switch to Break'}
          </button>
        </div>
        
        {/* Custom Time Settings */}
        <div className="time-settings">
          {/* Focus Time Setting */}
          <div className="setting-row">
            <label htmlFor="customTime" className={`setting-label ${darkMode ? 'dark-label' : 'light-label'}`}>
              Focus Duration:
            </label>
            <div className="input-group">
              <input
                id="customTime"
                type="number"
                min="1"
                value={customTime}
                onChange={handleCustomTimeChange}
                className={`time-input ${darkMode ? 'dark-input' : 'light-input'}`}
              />
              <span className={`time-unit ${darkMode ? 'dark-text' : 'light-text'}`}>min</span>
              <button
                onClick={applyCustomTime}
                className={`set-button ${darkMode ? 'dark-set' : 'light-set'}`}
              >
                Set
              </button>
            </div>
          </div>
          
          {/* Break Time Setting */}
          <div className="setting-row">
            <label htmlFor="breakTime" className={`setting-label ${darkMode ? 'dark-label' : 'light-label'}`}>
              Break Duration:
            </label>
            <div className="input-group">
              <input
                id="breakTime"
                type="number"
                min="1"
                value={breakTime}
                onChange={handleBreakTimeChange}
                className={`time-input ${darkMode ? 'dark-input' : 'light-input'}`}
              />
              <span className={`time-unit ${darkMode ? 'dark-text' : 'light-text'}`}>min</span>
              <button
                onClick={applyBreakTime}
                className={`set-button ${darkMode ? 'dark-set' : 'light-set'}`}
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <p className={`footer-text ${darkMode ? 'dark-footer' : 'light-footer'}`}>
        Alternate between focus and breaks for optimal productivity
      </p>
    </div>
  );
}

export default App;
