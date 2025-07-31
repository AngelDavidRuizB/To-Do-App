import { useState, useEffect } from 'react';
import { CheckSquare, Clock, FileText, Heart, TrendingUp, Calendar } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    tasksInProgress: 0,
    tasksPending: 0,
    pomodoroSessions: 0,
    studyTime: 0,
    notesCount: 0,
    stressLevel: 5
  });

  useEffect(() => {
    // Load stats from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const pomodoroStats = JSON.parse(localStorage.getItem('pomodoroStats') || '{"sessions": 0, "totalTime": 0}');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const healthData = JSON.parse(localStorage.getItem('healthData') || '{"stressLevel": 5}');

    setStats({
      tasksCompleted: tasks.filter(task => task.status === 'hechas').length,
      tasksInProgress: tasks.filter(task => task.status === 'en progreso').length,
      tasksPending: tasks.filter(task => task.status === 'no hechas').length,
      pomodoroSessions: pomodoroStats.sessions,
      studyTime: Math.round(pomodoroStats.totalTime / 60), // Convert to minutes
      notesCount: notes.length,
      stressLevel: healthData.stressLevel
    });
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={32} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const getMotivationalMessage = () => {
    const messages = [
      "¡Excelente trabajo! Sigue así 💪",
      "Cada tarea completada es un paso hacia tus metas 🎯",
      "Tu productividad está mejorando día a día 📈",
      "Recuerda tomar descansos para mantener tu bienestar 🧘‍♀️",
      "La constancia es la clave del éxito ⭐"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="date">{new Date().toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <div className="motivational-banner">
        <div className="banner-content">
          <TrendingUp size={24} />
          <span>{getMotivationalMessage()}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={CheckSquare}
          title="Tareas Completadas"
          value={stats.tasksCompleted}
          color="green"
          subtitle="Hoy"
        />
        
        <StatCard
          icon={Clock}
          title="En Progreso"
          value={stats.tasksInProgress}
          color="orange"
          subtitle="Tareas activas"
        />
        
        <StatCard
          icon={Calendar}
          title="Pendientes"
          value={stats.tasksPending}
          color="blue"
          subtitle="Por hacer"
        />
        
        <StatCard
          icon={Clock}
          title="Sesiones Pomodoro"
          value={stats.pomodoroSessions}
          color="red"
          subtitle="Completadas"
        />
        
        <StatCard
          icon={Clock}
          title="Tiempo de Estudio"
          value={`${stats.studyTime}min`}
          color="purple"
          subtitle="Total acumulado"
        />
        
        <StatCard
          icon={FileText}
          title="Notas Guardadas"
          value={stats.notesCount}
          color="teal"
          subtitle="Organizadas por tema"
        />
        
        <StatCard
          icon={Heart}
          title="Nivel de Estrés"
          value={`${stats.stressLevel}/10`}
          color={stats.stressLevel <= 3 ? 'green' : stats.stressLevel <= 6 ? 'orange' : 'red'}
          subtitle="Último registro"
        />
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn task-btn">
            <CheckSquare size={20} />
            Nueva Tarea
          </button>
          <button className="action-btn pomodoro-btn">
            <Clock size={20} />
            Iniciar Pomodoro
          </button>
          <button className="action-btn notes-btn">
            <FileText size={20} />
            Nueva Nota
          </button>
          <button className="action-btn health-btn">
            <Heart size={20} />
            Registro de Bienestar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
