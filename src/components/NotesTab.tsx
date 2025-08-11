import React, { useState } from 'react';
import { StickyNote, Plus, Edit3, Trash2, Check, X, CheckSquare, Square } from 'lucide-react';
import { Note, TodoItem } from '../types';

interface NotesTabProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id'>) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

const NotesTab: React.FC<NotesTabProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'todos'>('notes');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'note' as const
  });
  const [editContent, setEditContent] = useState({ title: '', content: '' });

  // Parse todos from notes
  const todoNotes = notes.filter(note => note.type === 'todo');
  const regularNotes = notes.filter(note => note.type === 'note');

  const parseTodos = (content: string): TodoItem[] => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      const isCompleted = line.startsWith('✓') || line.startsWith('[x]');
      const text = line.replace(/^(\[x\]|\[ \]|✓|•|-)\s*/, '').trim();
      return {
        id: `${index}`,
        text,
        completed: isCompleted,
        createdAt: new Date().toISOString()
      };
    });
  };

  const formatTodos = (todos: TodoItem[]): string => {
    return todos.map(todo => 
      `${todo.completed ? '✓' : '•'} ${todo.text}`
    ).join('\n');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title.trim() && newNote.content.trim()) {
      onAddNote({
        ...newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setNewNote({ title: '', content: '', type: 'note' });
      setShowAddForm(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditContent({ title: note.title, content: note.content });
  };

  const handleSaveEdit = () => {
    if (editingNote && editContent.title.trim() && editContent.content.trim()) {
      onUpdateNote(editingNote, {
        title: editContent.title,
        content: editContent.content,
        updatedAt: new Date().toISOString()
      });
      setEditingNote(null);
      setEditContent({ title: '', content: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent({ title: '', content: '' });
  };

  const toggleTodoItem = (noteId: string, todoIndex: number) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      const todos = parseTodos(note.content);
      todos[todoIndex].completed = !todos[todoIndex].completed;
      const newContent = formatTodos(todos);
      onUpdateNote(noteId, {
        content: newContent,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <StickyNote className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mes Notes</h2>
        <p className="text-gray-600">Capture tes pensées et organise tes tâches</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-2 shadow-md border">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'notes'
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-600 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              📝 Notes libres
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'todos'
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-600 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              ✅ To-Do Lists
            </button>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setNewNote({ ...newNote, type: activeTab === 'todos' ? 'todo' : 'note' });
            setShowAddForm(true);
          }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>{activeTab === 'todos' ? 'Nouvelle To-Do List' : 'Nouvelle Note'}</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <StickyNote className="w-5 h-5 text-amber-500" />
            <span>{activeTab === 'todos' ? 'Créer une To-Do List' : 'Créer une Note'}</span>
          </h3>
          
          <form onSubmit={handleAddNote} className="space-y-4">
            <input
              type="text"
              placeholder="Titre..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
            
            <textarea
              placeholder={activeTab === 'todos' ? 
                "• Tâche 1\n• Tâche 2\n• Tâche 3\n\n(Utilise • ou - pour les puces)" : 
                "Écris tes pensées, idées, réflexions..."
              }
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={6}
              required
            />
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewNote({ title: '', content: '', type: 'note' });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes Display */}
      <div className="space-y-4">
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularNotes.map((note) => (
              <div key={note.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                {editingNote === note.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editContent.title}
                      onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <textarea
                      value={editContent.content}
                      onChange={(e) => setEditContent({ ...editContent, content: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      rows={4}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 text-lg">{note.title}</h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="text-gray-400 hover:text-amber-500 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap mb-3">{note.content}</p>
                    <div className="text-xs text-gray-400">
                      {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'todos' && (
          <div className="space-y-4">
            {todoNotes.map((note) => {
              const todos = parseTodos(note.content);
              const completedCount = todos.filter(t => t.completed).length;
              
              return (
                <div key={note.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{note.title}</h3>
                      <p className="text-sm text-gray-500">
                        {completedCount}/{todos.length} terminées
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="text-gray-400 hover:text-amber-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {todos.map((todo, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleTodoItem(note.id, index)}
                          className={`transition-colors ${
                            todo.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                          }`}
                        >
                          {todo.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                        <span className={`flex-1 ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-700'
                        }`}>
                          {todo.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-3">
                    Modifiée le {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {((activeTab === 'notes' && regularNotes.length === 0) || 
        (activeTab === 'todos' && todoNotes.length === 0)) && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <StickyNote className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {activeTab === 'todos' ? 'Aucune to-do list' : 'Aucune note'}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'todos' 
              ? 'Crée ta première liste de tâches pour t\'organiser'
              : 'Commence à capturer tes pensées et idées'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NotesTab;