import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Edit2, 
  Folder, 
  Tag,
  Calendar,
  Filter
} from 'lucide-react';
import './NotesManager.css';

const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    topic: '',
    subject: '',
    tags: '',
    type: 'text' // 'text' or 'file'
  });

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
    setFilteredNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    let filtered = notes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by topic
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(note => note.topic === selectedTopic);
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedTopic, selectedSubject]);

  const addNote = () => {
    if (newNote.title.trim()) {
      const note = {
        id: Date.now(),
        ...newNote,
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      resetForm();
    }
  };

  const updateNote = () => {
    if (newNote.title.trim()) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? {
              ...note,
              ...newNote,
              tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
              updatedAt: new Date().toISOString()
            }
          : note
      ));
      resetForm();
    }
  };

  const deleteNote = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const editNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      topic: note.topic,
      subject: note.subject,
      tags: note.tags.join(', '),
      type: note.type
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewNote({
      title: '',
      content: '',
      topic: '',
      subject: '',
      tags: '',
      type: 'text'
    });
    setEditingNote(null);
    setShowAddForm(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewNote({
          ...newNote,
          content: e.target.result,
          type: 'file',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadFile = (note) => {
    if (note.type === 'file' && note.content) {
      const link = document.createElement('a');
      link.href = note.content;
      link.download = note.fileName || 'archivo';
      link.click();
    }
  };

  const getUniqueTopics = () => {
    const topics = [...new Set(notes.map(note => note.topic).filter(Boolean))];
    return topics.sort();
  };

  const getUniqueSubjects = () => {
    const subjects = [...new Set(notes.map(note => note.subject).filter(Boolean))];
    return subjects.sort();
  };

  const getAllTags = () => {
    const allTags = notes.flatMap(note => note.tags || []);
    return [...new Set(allTags)].sort();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="notes-manager">
      <div className="notes-header">
        <h1>Gestión de Notas y Archivos</h1>
        <div className="header-actions">
          <button 
            className="add-note-btn"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={20} />
            Nueva Nota
          </button>
        </div>
      </div>

      <div className="notes-stats">
        <div className="stat-item">
          <FileText size={24} />
          <div>
            <span className="stat-number">{notes.length}</span>
            <span className="stat-label">Total de Notas</span>
          </div>
        </div>
        <div className="stat-item">
          <Folder size={24} />
          <div>
            <span className="stat-number">{getUniqueTopics().length}</span>
            <span className="stat-label">Temas</span>
          </div>
        </div>
        <div className="stat-item">
          <Tag size={24} />
          <div>
            <span className="stat-number">{getAllTags().length}</span>
            <span className="stat-label">Etiquetas</span>
          </div>
        </div>
      </div>

      <div className="notes-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los Temas</option>
            {getUniqueTopics().map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las Materias</option>
            {getUniqueSubjects().map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <button
            className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Vista de lista"
          >
            ☰
          </button>
          <button
            className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Vista de cuadrícula"
          >
            ⊞
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="note-form">
            <h3>{editingNote ? 'Editar Nota' : 'Nueva Nota'}</h3>
            
            <div className="form-row">
              <input
                type="text"
                placeholder="Título de la nota"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                placeholder="Tema (ej: Matemáticas, Historia)"
                value={newNote.topic}
                onChange={(e) => setNewNote({ ...newNote, topic: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Materia específica"
                value={newNote.subject}
                onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="content-type-tabs">
              <button
                className={`type-tab ${newNote.type === 'text' ? 'active' : ''}`}
                onClick={() => setNewNote({ ...newNote, type: 'text', content: '' })}
              >
                <FileText size={16} />
                Texto
              </button>
              <button
                className={`type-tab ${newNote.type === 'file' ? 'active' : ''}`}
                onClick={() => setNewNote({ ...newNote, type: 'file', content: '' })}
              >
                <Upload size={16} />
                Archivo
              </button>
            </div>

            {newNote.type === 'text' ? (
              <textarea
                placeholder="Contenido de la nota..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="form-textarea"
                rows="6"
              />
            ) : (
              <div className="file-upload-area">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Upload size={24} />
                  <span>Seleccionar archivo</span>
                </label>
                {newNote.fileName && (
                  <div className="uploaded-file-info">
                    <span>{newNote.fileName}</span>
                    <span>({formatFileSize(newNote.fileSize)})</span>
                  </div>
                )}
              </div>
            )}

            <input
              type="text"
              placeholder="Etiquetas (separadas por coma)"
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              className="form-input"
            />
            
            <div className="form-actions">
              <button className="btn-cancel" onClick={resetForm}>
                Cancelar
              </button>
              <button 
                className="btn-save"
                onClick={editingNote ? updateNote : addNote}
              >
                {editingNote ? 'Guardar Cambios' : 'Crear Nota'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`notes-list ${viewMode}`}>
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No hay notas</h3>
            <p>Comienza creando tu primera nota o archivo</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3 className="note-title">{note.title}</h3>
                <div className="note-actions">
                  {note.type === 'file' && (
                    <button
                      className="action-btn download"
                      onClick={() => downloadFile(note)}
                      title="Descargar archivo"
                    >
                      <Download size={16} />
                    </button>
                  )}
                  <button
                    className="action-btn edit"
                    onClick={() => editNote(note)}
                    title="Editar nota"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteNote(note.id)}
                    title="Eliminar nota"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="note-meta">
                {note.topic && (
                  <span className="note-topic">
                    <Folder size={14} />
                    {note.topic}
                  </span>
                )}
                {note.subject && (
                  <span className="note-subject">{note.subject}</span>
                )}
                <span className="note-date">
                  <Calendar size={14} />
                  {new Date(note.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>

              <div className="note-content">
                {note.type === 'text' ? (
                  <p>{note.content.substring(0, 200)}{note.content.length > 200 ? '...' : ''}</p>
                ) : (
                  <div className="file-info">
                    <Upload size={20} />
                    <div>
                      <span className="file-name">{note.fileName}</span>
                      <span className="file-size">({formatFileSize(note.fileSize)})</span>
                    </div>
                  </div>
                )}
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.map(tag => (
                    <span key={tag} className="tag">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesManager;
