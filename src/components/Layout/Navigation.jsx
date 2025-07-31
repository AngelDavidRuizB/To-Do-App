import { useState } from 'react';
import { Home, CheckSquare, Clock, FileText, Heart } from 'lucide-react';
import './Navigation.css';

const Navigation = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tareas' },
    { id: 'pomodoro', icon: Clock, label: 'Pomodoro' },
    { id: 'notes', icon: FileText, label: 'Notas' },
    { id: 'health', icon: Heart, label: 'Bienestar' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="nav-title">ProductiviApp</h1>
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
      
      <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        {menuItems.map(({ id, icon: Icon, label }) => (
          <li key={id} className="nav-item">
            <button
              className={`nav-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(id);
                setIsMenuOpen(false);
              }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
