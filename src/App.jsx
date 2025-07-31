import { useState } from 'react';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import TodoTasks from './components/TodoTasks/TodoTasks';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import NotesManager from './components/NotesManager/NotesManager';
import MentalHealthTracker from './components/MentalHealthTracker/MentalHealthTracker';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TodoTasks />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'notes':
        return <NotesManager />;
      case 'health':
        return <MentalHealthTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <main className="main-content">
        {renderActiveSection()}
      </main>
    </div>
  );
}

export default App;
