import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, BookOpen, Award } from 'lucide-react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  });
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0, // in seconds
    todaySessions: 0,
    currentStreak: 0
  });

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
    const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');
    
    setStats({
      totalSessions: savedStats.totalSessions || 0,
      totalTime: savedStats.totalTime || 0,
      todaySessions: savedStats.todaySessions || 0,
      currentStreak: savedStats.currentStreak || 0
    });
    
    setSettings({
      workDuration: savedSettings.workDuration || 25,
      shortBreakDuration: savedSettings.shortBreakDuration || 5,
      longBreakDuration: savedSettings.longBreakDuration || 15,
      sessionsUntilLongBreak: savedSettings.sessionsUntilLongBreak || 4
    });

    // Initialize timeLeft based on current mode and settings
    setTimeLeft((savedSettings.workDuration || 25) * 60);
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    playNotificationSound();
    
    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Update stats
      const newStats = {
        ...stats,
        totalSessions: stats.totalSessions + 1,
        totalTime: stats.totalTime + settings.workDuration * 60,
        todaySessions: stats.todaySessions + 1,
        currentStreak: stats.currentStreak + 1
      };
      setStats(newStats);
      localStorage.setItem('pomodoroStats', JSON.stringify(newStats));
      
      // Determine next break type
      if (newSessionsCompleted % settings.sessionsUntilLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    const duration = mode === 'work' ? settings.workDuration : 
                    mode === 'shortBreak' ? settings.shortBreakDuration : 
                    settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    const duration = newMode === 'work' ? settings.workDuration : 
                    newMode === 'shortBreak' ? settings.shortBreakDuration : 
                    settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const saveSettings = () => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    setShowSettings(false);
    // Reset timer with new settings
    resetTimer();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalDuration = mode === 'work' ? settings.workDuration * 60 : 
                         mode === 'shortBreak' ? settings.shortBreakDuration * 60 : 
                         settings.longBreakDuration * 60;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const getModeInfo = () => {
    switch (mode) {
      case 'work':
        return {
          title: 'Tiempo de Trabajo',
          icon: <BookOpen size={32} />,
          color: 'work',
          description: 'Concéntrate en tus tareas'
        };
      case 'shortBreak':
        return {
          title: 'Descanso Corto',
          icon: <Coffee size={32} />,
          color: 'short-break',
          description: 'Tómate un respiro'
        };
      case 'longBreak':
        return {
          title: 'Descanso Largo',
          icon: <Coffee size={32} />,
          color: 'long-break',
          description: 'Relájate y recarga energías'
        };
      default:
        return {
          title: 'Pomodoro',
          icon: <BookOpen size={32} />,
          color: 'work',
          description: ''
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="pomodoro-timer">
      <div className="timer-header">
        <h1>Timer Pomodoro</h1>
        <button 
          className="settings-btn"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="timer-stats">
        <div className="stat-card">
          <Award size={24} />
          <div>
            <span className="stat-number">{stats.totalSessions}</span>
            <span className="stat-label">Sesiones Totales</span>
          </div>
        </div>
        <div className="stat-card">
          <BookOpen size={24} />
          <div>
            <span className="stat-number">{stats.todaySessions}</span>
            <span className="stat-label">Hoy</span>
          </div>
        </div>
        <div className="stat-card">
          <Coffee size={24} />
          <div>
            <span className="stat-number">{Math.round(stats.totalTime / 3600)}h</span>
            <span className="stat-label">Tiempo Total</span>
          </div>
        </div>
      </div>

      <div className="mode-tabs">
        <button 
          className={`mode-tab ${mode === 'work' ? 'active' : ''}`}
          onClick={() => switchMode('work')}
        >
          Trabajo
        </button>
        <button 
          className={`mode-tab ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchMode('shortBreak')}
        >
          Descanso Corto
        </button>
        <button 
          className={`mode-tab ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchMode('longBreak')}
        >
          Descanso Largo
        </button>
      </div>

      <div className={`timer-container ${modeInfo.color}`}>
        <div className="timer-mode-info">
          {modeInfo.icon}
          <h2>{modeInfo.title}</h2>
          <p>{modeInfo.description}</p>
        </div>

        <div className="timer-circle">
          <svg className="progress-ring" width="300" height="300">
            <circle
              className="progress-ring-background"
              cx="150"
              cy="150"
              r="140"
            />
            <circle
              className="progress-ring-progress"
              cx="150"
              cy="150"
              r="140"
              style={{
                strokeDasharray: `${2 * Math.PI * 140}`,
                strokeDashoffset: `${2 * Math.PI * 140 * (1 - getProgress() / 100)}`
              }}
            />
          </svg>
          <div className="timer-display">
            <span className="time">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="timer-controls">
          <button 
            className="control-btn reset"
            onClick={resetTimer}
            title="Reiniciar"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            className={`control-btn play-pause ${isActive ? 'pause' : 'play'}`}
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} />}
          </button>
          
          <div className="sessions-indicator">
            <span>Sesión {sessionsCompleted + 1}</span>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay">
          <div className="settings-modal">
            <h3>Configuración del Timer</h3>
            
            <div className="setting-group">
              <label>Duración de Trabajo (minutos)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={settings.workDuration}
                onChange={(e) => setSettings({
                  ...settings,
                  workDuration: parseInt(e.target.value) || 25
                })}
                className="setting-input"
              />
            </div>
            
            <div className="setting-group">
              <label>Descanso Corto (minutos)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) => setSettings({
                  ...settings,
                  shortBreakDuration: parseInt(e.target.value) || 5
                })}
                className="setting-input"
              />
            </div>
            
            <div className="setting-group">
              <label>Descanso Largo (minutos)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) => setSettings({
                  ...settings,
                  longBreakDuration: parseInt(e.target.value) || 15
                })}
                className="setting-input"
              />
            </div>
            
            <div className="setting-group">
              <label>Sesiones hasta descanso largo</label>
              <input
                type="number"
                min="2"
                max="10"
                value={settings.sessionsUntilLongBreak}
                onChange={(e) => setSettings({
                  ...settings,
                  sessionsUntilLongBreak: parseInt(e.target.value) || 4
                })}
                className="setting-input"
              />
            </div>
            
            <div className="settings-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowSettings(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-save"
                onClick={saveSettings}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
