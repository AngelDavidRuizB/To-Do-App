import { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  Activity, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Smile, 
  Meh, 
  Frown,
  Plus,
  BarChart3,
  Target,
  BookOpen
} from 'lucide-react';
import './MentalHealthTracker.css';

const MentalHealthTracker = () => {
  const [healthData, setHealthData] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    stress: 5,
    energy: 5,
    sleep: 7,
    notes: '',
    activities: []
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'year'
  const [recommendations, setRecommendations] = useState([]);

  const moodOptions = [
    { value: 1, label: 'Muy Mal', icon: Frown, color: '#e74c3c' },
    { value: 2, label: 'Mal', icon: Frown, color: '#e67e22' },
    { value: 3, label: 'Regular', icon: Meh, color: '#f39c12' },
    { value: 4, label: 'Bien', icon: Smile, color: '#27ae60' },
    { value: 5, label: 'Muy Bien', icon: Smile, color: '#2ecc71' }
  ];

  const activityOptions = [
    'Ejercicio', 'Meditación', 'Lectura', 'Música', 'Caminar',
    'Socializar', 'Estudiar', 'Trabajar', 'Descansar', 'Cocinar',
    'Arte/Creatividad', 'Videojuegos', 'Series/Películas', 'Deporte'
  ];

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('healthData') || '[]');
    setHealthData(savedData);
    generateRecommendations(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem('healthData', JSON.stringify(healthData));
    generateRecommendations(healthData);
  }, [healthData]);

  const addEntry = () => {
    if (currentEntry.date) {
      // Check if entry for this date already exists
      const existingIndex = healthData.findIndex(entry => entry.date === currentEntry.date);
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updatedData = [...healthData];
        updatedData[existingIndex] = { ...currentEntry, id: updatedData[existingIndex].id };
        setHealthData(updatedData);
      } else {
        // Add new entry
        const newEntry = {
          ...currentEntry,
          id: Date.now(),
          timestamp: new Date().toISOString()
        };
        setHealthData([newEntry, ...healthData]);
      }
      
      resetForm();
    }
  };

  const resetForm = () => {
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 5,
      stress: 5,
      energy: 5,
      sleep: 7,
      notes: '',
      activities: []
    });
    setShowAddForm(false);
  };

  const generateRecommendations = (data) => {
    if (data.length === 0) {
      setRecommendations([]);
      return;
    }

    const recentData = data.slice(0, 7); // Last 7 entries
    const avgMood = recentData.reduce((sum, entry) => sum + entry.mood, 0) / recentData.length;
    const avgStress = recentData.reduce((sum, entry) => sum + entry.stress, 0) / recentData.length;
    const avgEnergy = recentData.reduce((sum, entry) => sum + entry.energy, 0) / recentData.length;
    const avgSleep = recentData.reduce((sum, entry) => sum + entry.sleep, 0) / recentData.length;

    const newRecommendations = [];

    if (avgMood < 3) {
      newRecommendations.push({
        type: 'mood',
        icon: Heart,
        title: 'Mejora tu Estado de Ánimo',
        message: 'Tu estado de ánimo ha estado bajo últimamente. Considera actividades que disfrutes.',
        actions: ['Escuchar música que te guste', 'Hacer ejercicio ligero', 'Contactar a un amigo']
      });
    }

    if (avgStress > 7) {
      newRecommendations.push({
        type: 'stress',
        icon: Brain,
        title: 'Reduce tu Nivel de Estrés',
        message: 'Tu nivel de estrés está alto. Es importante que tomes medidas para relajarte.',
        actions: ['Practicar respiración profunda', 'Hacer una pausa', 'Organizar tus tareas por prioridad']
      });
    }

    if (avgEnergy < 3) {
      newRecommendations.push({
        type: 'energy',
        icon: Activity,
        title: 'Aumenta tu Nivel de Energía',
        message: 'Tu energía está baja. Considera cambios en tu rutina.',
        actions: ['Mejorar tu horario de sueño', 'Hacer ejercicio regular', 'Revisar tu alimentación']
      });
    }

    if (avgSleep < 6) {
      newRecommendations.push({
        type: 'sleep',
        icon: Calendar,
        title: 'Mejora tu Calidad de Sueño',
        message: 'No estás durmiendo lo suficiente. El sueño es crucial para tu bienestar.',
        actions: ['Establecer una rutina nocturna', 'Evitar pantallas antes de dormir', 'Crear un ambiente relajante']
      });
    }

    setRecommendations(newRecommendations);
  };

  const getFilteredData = () => {
    const now = new Date();
    const filtered = healthData.filter(entry => {
      const entryDate = new Date(entry.date);
      const diffTime = Math.abs(now - entryDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (selectedPeriod) {
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        case 'year':
          return diffDays <= 365;
        default:
          return true;
      }
    });

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getAverages = () => {
    const data = getFilteredData();
    if (data.length === 0) return { mood: 0, stress: 0, energy: 0, sleep: 0 };

    return {
      mood: (data.reduce((sum, entry) => sum + entry.mood, 0) / data.length).toFixed(1),
      stress: (data.reduce((sum, entry) => sum + entry.stress, 0) / data.length).toFixed(1),
      energy: (data.reduce((sum, entry) => sum + entry.energy, 0) / data.length).toFixed(1),
      sleep: (data.reduce((sum, entry) => sum + entry.sleep, 0) / data.length).toFixed(1)
    };
  };

  const getMoodIcon = (mood) => {
    const option = moodOptions.find(opt => opt.value === Math.round(mood));
    return option ? option.icon : Meh;
  };

  const getMoodColor = (mood) => {
    const option = moodOptions.find(opt => opt.value === Math.round(mood));
    return option ? option.color : '#95a5a6';
  };

  const toggleActivity = (activity) => {
    const activities = currentEntry.activities.includes(activity)
      ? currentEntry.activities.filter(a => a !== activity)
      : [...currentEntry.activities, activity];
    setCurrentEntry({ ...currentEntry, activities });
  };

  const averages = getAverages();
  const filteredData = getFilteredData();

  return (
    <div className="mental-health-tracker">
      <div className="health-header">
        <h1>Seguimiento de Bienestar Mental</h1>
        <button 
          className="add-entry-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Nuevo Registro
        </button>
      </div>

      <div className="health-overview">
        <div className="overview-stats">
          <div className="stat-card mood">
            <div className="stat-icon">
              {React.createElement(getMoodIcon(averages.mood), { 
                size: 32, 
                color: getMoodColor(averages.mood) 
              })}
            </div>
            <div className="stat-info">
              <span className="stat-value">{averages.mood}/5</span>
              <span className="stat-label">Estado de Ánimo</span>
            </div>
          </div>

          <div className="stat-card stress">
            <div className="stat-icon">
              <Brain size={32} color="#e74c3c" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{averages.stress}/10</span>
              <span className="stat-label">Nivel de Estrés</span>
            </div>
          </div>

          <div className="stat-card energy">
            <div className="stat-icon">
              <Activity size={32} color="#f39c12" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{averages.energy}/10</span>
              <span className="stat-label">Nivel de Energía</span>
            </div>
          </div>

          <div className="stat-card sleep">
            <div className="stat-icon">
              <Calendar size={32} color="#9b59b6" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{averages.sleep}h</span>
              <span className="stat-label">Horas de Sueño</span>
            </div>
          </div>
        </div>

        <div className="period-selector">
          <button 
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Última Semana
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Último Mes
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Último Año
          </button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>Recomendaciones Personalizadas</h2>
          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.type}`}>
                <div className="rec-header">
                  <rec.icon size={24} />
                  <h3>{rec.title}</h3>
                </div>
                <p>{rec.message}</p>
                <ul className="rec-actions">
                  {rec.actions.map((action, actionIndex) => (
                    <li key={actionIndex}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="health-form">
            <h3>Nuevo Registro de Bienestar</h3>
            
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={currentEntry.date}
                onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Estado de Ánimo (1-5)</label>
              <div className="mood-selector">
                {moodOptions.map(option => (
                  <button
                    key={option.value}
                    className={`mood-btn ${currentEntry.mood === option.value ? 'active' : ''}`}
                    onClick={() => setCurrentEntry({ ...currentEntry, mood: option.value })}
                    style={{ color: option.color }}
                  >
                    <option.icon size={24} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Nivel de Estrés (1-10): {currentEntry.stress}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.stress}
                onChange={(e) => setCurrentEntry({ ...currentEntry, stress: parseInt(e.target.value) })}
                className="range-input stress"
              />
            </div>

            <div className="form-group">
              <label>Nivel de Energía (1-10): {currentEntry.energy}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.energy}
                onChange={(e) => setCurrentEntry({ ...currentEntry, energy: parseInt(e.target.value) })}
                className="range-input energy"
              />
            </div>

            <div className="form-group">
              <label>Horas de Sueño: {currentEntry.sleep}</label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={currentEntry.sleep}
                onChange={(e) => setCurrentEntry({ ...currentEntry, sleep: parseFloat(e.target.value) })}
                className="range-input sleep"
              />
            </div>

            <div className="form-group">
              <label>Actividades Realizadas</label>
              <div className="activities-grid">
                {activityOptions.map(activity => (
                  <button
                    key={activity}
                    className={`activity-btn ${currentEntry.activities.includes(activity) ? 'active' : ''}`}
                    onClick={() => toggleActivity(activity)}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Notas Adicionales</label>
              <textarea
                placeholder="¿Cómo te sientes hoy? ¿Qué factores influyeron en tu estado de ánimo?"
                value={currentEntry.notes}
                onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
                className="form-textarea"
                rows="4"
              />
            </div>
            
            <div className="form-actions">
              <button className="btn-cancel" onClick={resetForm}>
                Cancelar
              </button>
              <button className="btn-save" onClick={addEntry}>
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="health-history">
        <h2>Historial de Registros</h2>
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <Heart size={48} />
            <h3>No hay registros</h3>
            <p>Comienza registrando tu estado de bienestar diario</p>
          </div>
        ) : (
          <div className="history-list">
            {filteredData.map(entry => (
              <div key={entry.id} className="history-entry">
                <div className="entry-header">
                  <div className="entry-date">
                    <Calendar size={16} />
                    {new Date(entry.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="entry-mood">
                    {React.createElement(getMoodIcon(entry.mood), { 
                      size: 20, 
                      color: getMoodColor(entry.mood) 
                    })}
                  </div>
                </div>
                
                <div className="entry-metrics">
                  <div className="metric">
                    <span className="metric-label">Estrés:</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill stress" 
                        style={{ width: `${(entry.stress / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="metric-value">{entry.stress}/10</span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">Energía:</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill energy" 
                        style={{ width: `${(entry.energy / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="metric-value">{entry.energy}/10</span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">Sueño:</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill sleep" 
                        style={{ width: `${(entry.sleep / 12) * 100}%` }}
                      ></div>
                    </div>
                    <span className="metric-value">{entry.sleep}h</span>
                  </div>
                </div>

                {entry.activities.length > 0 && (
                  <div className="entry-activities">
                    <span className="activities-label">Actividades:</span>
                    {entry.activities.map(activity => (
                      <span key={activity} className="activity-tag">{activity}</span>
                    ))}
                  </div>
                )}

                {entry.notes && (
                  <div className="entry-notes">
                    <p>{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthTracker;
