import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import './TodoTasks.css';

const TodoTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'media',
    dueDate: '',
    category: ''
  });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        status: 'no hechas',
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'media', dueDate: '', category: '' });
      setShowAddForm(false);
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'hechas' ? new Date().toISOString() : null
        };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category
    });
    setShowAddForm(true);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...newTask }
        : task
    ));
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'media', dueDate: '', category: '' });
    setShowAddForm(false);
  };

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.status === filter);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hechas':
        return <CheckCircle2 className="status-icon completed" />;
      case 'en progreso':
        return <PlayCircle className="status-icon in-progress" />;
      default:
        return <Circle className="status-icon pending" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'high';
      case 'media': return 'medium';
      case 'baja': return 'low';
      default: return 'medium';
    }
  };

  const getStatusCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="todo-tasks">
      <div className="tasks-header">
        <h1>Gestión de Tareas</h1>
        <button 
          className="add-task-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{getStatusCount('no hechas')}</span>
          <span className="stat-label">No Hechas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{getStatusCount('en progreso')}</span>
          <span className="stat-label">En Progreso</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{getStatusCount('hechas')}</span>
          <span className="stat-label">Completadas</span>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({tasks.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'no hechas' ? 'active' : ''}`}
          onClick={() => setFilter('no hechas')}
        >
          No Hechas ({getStatusCount('no hechas')})
        </button>
        <button 
          className={`filter-tab ${filter === 'en progreso' ? 'active' : ''}`}
          onClick={() => setFilter('en progreso')}
        >
          En Progreso ({getStatusCount('en progreso')})
        </button>
        <button 
          className={`filter-tab ${filter === 'hechas' ? 'active' : ''}`}
          onClick={() => setFilter('hechas')}
        >
          Completadas ({getStatusCount('hechas')})
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="task-form">
            <h3>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            
            <input
              type="text"
              placeholder="Título de la tarea"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="form-input"
            />
            
            <textarea
              placeholder="Descripción (opcional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="form-textarea"
              rows="3"
            />
            
            <div className="form-row">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="form-select"
              >
                <option value="baja">Prioridad Baja</option>
                <option value="media">Prioridad Media</option>
                <option value="alta">Prioridad Alta</option>
              </select>
              
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="form-input"
              />
            </div>
            
            <input
              type="text"
              placeholder="Categoría (ej: Trabajo, Personal, Estudio)"
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="form-input"
            />
            
            <div className="form-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTask(null);
                  setNewTask({ title: '', description: '', priority: 'media', dueDate: '', category: '' });
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn-save"
                onClick={editingTask ? saveEdit : addTask}
              >
                {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tasks-list">
        {getFilteredTasks().length === 0 ? (
          <div className="empty-state">
            <Circle size={48} />
            <h3>No hay tareas</h3>
            <p>
              {filter === 'all' 
                ? 'Comienza creando tu primera tarea'
                : `No hay tareas ${filter}`
              }
            </p>
          </div>
        ) : (
          getFilteredTasks().map(task => (
            <div key={task.id} className={`task-card ${task.status.replace(' ', '-')}`}>
              <div className="task-main">
                <div className="task-status">
                  {getStatusIcon(task.status)}
                </div>
                
                <div className="task-content">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  
                  <div className="task-meta">
                    {task.category && (
                      <span className="task-category">{task.category}</span>
                    )}
                    {task.dueDate && (
                      <span className="task-due-date">
                        <Clock size={14} />
                        {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="task-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => editTask(task)}
                    title="Editar tarea"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteTask(task.id)}
                    title="Eliminar tarea"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="status-controls">
                <button
                  className={`status-btn ${task.status === 'no hechas' ? 'active' : ''}`}
                  onClick={() => updateTaskStatus(task.id, 'no hechas')}
                >
                  No Hechas
                </button>
                <button
                  className={`status-btn ${task.status === 'en progreso' ? 'active' : ''}`}
                  onClick={() => updateTaskStatus(task.id, 'en progreso')}
                >
                  En Progreso
                </button>
                <button
                  className={`status-btn ${task.status === 'hechas' ? 'active' : ''}`}
                  onClick={() => updateTaskStatus(task.id, 'hechas')}
                >
                  Completada
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoTasks;
