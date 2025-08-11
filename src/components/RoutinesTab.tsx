import React, { useState } from 'react';
import { Plus, Play, Volume2, Check, TrendingUp, Target, Edit3, Trash2 } from 'lucide-react';
import { Routine, RoutineTemplate } from '../types';
import { extendedRoutineTemplates, meditationGuides } from '../data/mockData';

interface RoutinesTabProps {
  routines: Routine[];
  onAddRoutine: (routine: Omit<Routine, 'id'>) => void;
  onEditRoutine: (id: string, updates: Partial<Routine>) => void;
  onDeleteRoutine: (id: string) => void;
  onCompleteRoutine: (id: string) => void;
}

const RoutinesTab: React.FC<RoutinesTabProps> = ({
  routines,
  onAddRoutine,
  onEditRoutine,
  onDeleteRoutine,
  onCompleteRoutine
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [showMeditationGuide, setShowMeditationGuide] = useState<number | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    duration: 10,
    scheduledTime: '',
    notificationsEnabled: false
  });
  const [meditationTimer, setMeditationTimer] = useState<{
    routineId: string | null;
    timeLeft: number;
    isRunning: boolean;
    totalTime: number;
    startTime: number;
  }>({
    routineId: null,
    timeLeft: 0,
    isRunning: false,
    totalTime: 0,
    startTime: 0
  });
  
  const [customRoutine, setCustomRoutine] = useState({
    title: '',
    description: '',
    category: 'morning' as const,
    duration: 10,
    color: 'bg-purple-500',
    icon: '⭐',
    scheduledTime: '',
    notificationsEnabled: false
  });

  const categories = {
    morning: { label: 'Matin', icon: '🌅', color: 'from-orange-400 to-orange-600' },
    afternoon: { label: 'Après-midi', icon: '☀️', color: 'from-yellow-400 to-yellow-600' },
    evening: { label: 'Soir', icon: '🌙', color: 'from-indigo-400 to-indigo-600' }
  };

  const handleAddTemplate = (template: RoutineTemplate) => {
    const currentStep = template.progressionSteps[0];
    onAddRoutine({
      title: template.title,
      description: currentStep.description,
      category: template.category,
      duration: currentStep.duration,
      completed: false,
      streak: 0,
      week: 1,
      maxWeeks: template.progressionSteps.length,
      color: template.color,
      icon: template.icon,
      isProgressive: template.isProgressive,
      progressionSteps: template.progressionSteps
    });
    setShowTemplates(false);
  };

  const handleAddCustomRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoutine({
      ...customRoutine,
      completed: false,
      streak: 0,
      week: 1,
      maxWeeks: 1,
      isProgressive: false,
      progressionSteps: [
        { week: 1, duration: customRoutine.duration, description: customRoutine.description }
      ],
      scheduledTime: customRoutine.scheduledTime,
      notificationsEnabled: customRoutine.notificationsEnabled
    });
    setCustomRoutine({
      title: '',
      description: '',
      category: 'morning',
      duration: 10,
      color: 'bg-purple-500',
      icon: '⭐',
      scheduledTime: '',
      notificationsEnabled: false
    });
    setShowCustomForm(false);
  };

  const getMeditationGuide = (week: number) => {
    return meditationGuides.find(guide => guide.week <= week) || meditationGuides[0];
  };

  const morningRoutines = routines.filter(r => r.category === 'morning');
  const afternoonRoutines = routines.filter(r => r.category === 'afternoon');
  const eveningRoutines = routines.filter(r => r.category === 'evening');

  // Meditation timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meditationTimer.isRunning && meditationTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setMeditationTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (meditationTimer.timeLeft === 0 && meditationTimer.isRunning) {
      // Timer finished - complete the routine
      if (meditationTimer.routineId) {
        onCompleteRoutine(meditationTimer.routineId);
        setMeditationTimer({
          routineId: null,
          timeLeft: 0,
          isRunning: false,
          totalTime: 0,
          startTime: 0
        });
      }
    }
    return () => clearInterval(interval);
  }, [meditationTimer.isRunning, meditationTimer.timeLeft, meditationTimer.routineId, onCompleteRoutine]);

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine.id);
    setEditForm({
      title: routine.title,
      description: routine.description,
      duration: routine.duration,
      scheduledTime: routine.scheduledTime || '',
      notificationsEnabled: routine.notificationsEnabled || false
    });
  };

  const handleSaveEdit = () => {
    if (editingRoutine) {
      onEditRoutine(editingRoutine, editForm);
      setEditingRoutine(null);
    }
  };

  const handleDeleteRoutine = (routineId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette routine ?')) {
      onDeleteRoutine(routineId);
    }
  };

  const startMeditation = (routine: Routine) => {
    const timeInSeconds = routine.duration * 60;
    const now = Date.now();
    setMeditationTimer({
      routineId: routine.id,
      timeLeft: timeInSeconds,
      isRunning: true,
      totalTime: timeInSeconds,
      startTime: now
    });
  };

  const stopMeditation = () => {
    setMeditationTimer({
      routineId: null,
      timeLeft: 0,
      isRunning: false,
      totalTime: 0,
      startTime: 0
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRoutine = (routineId: string) => {
    // If meditation is running for this routine, stop it
    if (meditationTimer.routineId === routineId && meditationTimer.isRunning) {
      stopMeditation();
    }
    onCompleteRoutine(routineId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Mes Routines</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une routine</span>
          </button>
        </div>
      </div>

      {/* Template Selection */}
      {showTemplates && (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-3">Choisir une routine</h3>
          
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-4 overflow-x-auto">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as any)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {extendedRoutineTemplates
              .filter(template => template.category === selectedCategory)
              .map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-8 h-8 ${template.color} rounded-full flex items-center justify-center text-white text-sm`}>
                      {template.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{template.title}</h4>
                      <p className="text-xs text-gray-600">
                        {template.isProgressive ? 'Progressive' : template.progressionSteps[0].duration + ' min'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  {template.isProgressive && (
                    <div className="text-xs text-blue-600 mb-2">
                      Commence par {template.progressionSteps[0].duration} min, évolue jusqu'à {template.progressionSteps[template.progressionSteps.length - 1].duration} min
                    </div>
                  )}
                  <button
                    onClick={() => handleAddTemplate(template)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-xs transition-colors"
                  >
                    Ajouter cette routine
                  </button>
                </div>
              ))}
          </div>

          {/* Custom Routine Option */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              + Créer une routine personnalisée
            </button>
          </div>

          {/* Custom Form */}
          {showCustomForm && (
            <form onSubmit={handleAddCustomRoutine} className="mt-4 space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom de la routine"
                  value={customRoutine.title}
                  onChange={(e) => setCustomRoutine({...customRoutine, title: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  placeholder="Durée (minutes)"
                  value={customRoutine.duration}
                  onChange={(e) => setCustomRoutine({...customRoutine, duration: parseInt(e.target.value)})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="5"
                  max="120"
                  required
                />
                <input
                  type="time"
                  placeholder="Heure de rappel"
                  value={customRoutine.scheduledTime}
                  onChange={(e) => setCustomRoutine({...customRoutine, scheduledTime: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Description de la routine"
                value={customRoutine.description}
                onChange={(e) => setCustomRoutine({...customRoutine, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                required
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={customRoutine.notificationsEnabled}
                  onChange={(e) => setCustomRoutine({...customRoutine, notificationsEnabled: e.target.checked})}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="notifications" className="text-sm text-gray-700">
                  Activer les notifications (rappel 10 min avant)
                </label>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Meditation Guide Modal */}
      {showMeditationGuide !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Guide de Méditation</h3>
              <button
                onClick={() => setShowMeditationGuide(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {(() => {
              const guide = getMeditationGuide(showMeditationGuide);
              return (
                <div>
                  <h4 className="font-medium text-purple-600 mb-3">{guide.title}</h4>
                  <div className="space-y-2">
                    {guide.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm">{instruction}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => {
                        setShowMeditationGuide(null);
                        // Here you would start the meditation timer
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Commencer</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Routines by Category */}
      <div className="space-y-8">
        {/* Morning Routines */}
        {morningRoutines.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-full">
                <span className="text-2xl">🌅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Routines du Matin</h3>
            </div>
            <div className="space-y-3">
              {morningRoutines.map((routine) => (
                <div key={routine.id} className={`p-4 rounded-lg shadow-sm border ${
                  routine.isGoalLinked 
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200' 
                    : meditationTimer.routineId === routine.id && meditationTimer.isRunning
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
                    : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {!routine.title.toLowerCase().includes('méditation') || routine.completed ? (
                        <button
                          onClick={() => handleToggleRoutine(routine.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            routine.completed
                              ? routine.isGoalLinked 
                                ? 'bg-purple-500 border-purple-500 text-white hover:bg-purple-400 cursor-pointer'
                                : 'bg-green-500 border-green-500 text-white hover:bg-green-400 cursor-pointer'
                              : routine.isGoalLinked
                              ? 'border-purple-300 hover:border-purple-500 cursor-pointer'
                              : 'border-gray-300 hover:border-green-500 cursor-pointer'
                          }`}
                          title={routine.completed ? 'Cliquer pour décocher' : 'Cliquer pour cocher'}
                        >
                          {routine.completed && <Check className="w-4 h-4" />}
                        </button>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100"></div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{routine.icon}</span>
                          <h4 className={`font-medium ${routine.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {routine.title}
                          </h4>
                          {routine.isGoalLinked && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full flex items-center space-x-1">
                              <Target className="w-3 h-3" />
                              <span>Objectif</span>
                            </span>
                          )}
                          <span className="text-sm text-gray-500">({routine.duration} min)</span>
                          {routine.frequency && routine.frequency !== 'daily' && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {routine.frequency === 'weekly' ? '📆 Hebdo' : 
                               routine.frequency === 'monthly' ? '🗓️ Mensuel' : '📅 Quotidien'}
                            </span>
                          )}
                          {routine.isProgressive && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              Semaine {routine.week}/{routine.maxWeeks}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
                        
                        {/* Meditation Timer */}
                        {routine.title.toLowerCase().includes('méditation') && !routine.completed && (
                          <div className="mt-3">
                            {meditationTimer.routineId === routine.id && meditationTimer.isRunning ? (
                              <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-green-800 font-medium">🧘 Méditation en cours...</span>
                                  <button
                                    onClick={stopMeditation}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    Arrêter
                                  </button>
                                </div>
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-green-700 mb-2">
                                    {formatTime(meditationTimer.timeLeft)}
                                  </div>
                                  <div className="bg-green-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                      style={{ 
                                        width: `${meditationTimer.totalTime > 0 ? ((meditationTimer.totalTime - meditationTimer.timeLeft) / meditationTimer.totalTime) * 100 : 0}%` 
                                      }}
                                    ></div>
                                  </div>
                                  <div className="text-sm text-green-600 mt-2">
                                    {Math.round(((meditationTimer.totalTime - meditationTimer.timeLeft) / meditationTimer.totalTime) * 100)}% terminé
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <button
                                  onClick={() => startMeditation(routine)}
                                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                >
                                  <span>🧘</span>
                                  <span>Méditation guidée ({routine.duration} min)</span>
                                </button>
                                <button
                                  onClick={() => handleToggleRoutine(routine.id)}
                                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                >
                                  <span>🤲</span>
                                  <span>Méditation libre (marquer comme fait)</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message d'encouragement pour les routines d'objectifs */}
                        {routine.completed && routine.isGoalLinked && (
                          <div className="mt-2 p-2 bg-purple-100 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-700 font-medium flex items-center space-x-2">
                              <span>🎉</span>
                              <span>{routine.encouragementMessage || 'Bravo ! Tu te rapproches de ton objectif !'}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {routine.title.includes('Méditation') && (
                        <button
                          onClick={() => setShowMeditationGuide(routine.week)}
                          className="text-purple-600 hover:text-purple-700 p-1"
                          title="Guide de méditation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditRoutine(routine)}
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="Modifier la routine"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoutine(routine.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Supprimer la routine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {routine.isProgressive && (
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Edit Form */}
                  {editingRoutine === routine.id && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3">Modifier la routine</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Titre de la routine"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Description"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Durée (minutes)</label>
                            <input
                              type="number"
                              value={editForm.duration}
                              onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value) || 5})}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                              min="1"
                              max="180"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Heure de rappel</label>
                            <input
                              type="time"
                              value={editForm.scheduledTime}
                              onChange={(e) => setEditForm({...editForm, scheduledTime: e.target.value})}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`notifications-afternoon-${routine.id}`}
                            checked={editForm.notificationsEnabled}
                            onChange={(e) => setEditForm({...editForm, notificationsEnabled: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`notifications-afternoon-${routine.id}`} className="text-xs text-gray-700">
                            Activer les notifications
                          </label>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={() => setEditingRoutine(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Afternoon Routines */}
        {afternoonRoutines.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <span className="text-2xl">☀️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Routines de l'Après-midi</h3>
            </div>
            <div className="space-y-3">
              {afternoonRoutines.map((routine) => (
                <div key={routine.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => onCompleteRoutine(routine.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          routine.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {routine.completed && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{routine.icon}</span>
                          <h4 className={`font-medium ${routine.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {routine.title}
                          </h4>
                          <span className="text-sm text-gray-500">({routine.duration} min)</span>
                          {routine.isProgressive && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              Semaine {routine.week}/{routine.maxWeeks}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
                        
                        {/* Edit Form */}
                        {editingRoutine === routine.id && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-3">Modifier la routine</h4>
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="Titre de la routine"
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                rows={2}
                                placeholder="Description"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Durée (minutes)</label>
                                  <input
                                    type="number"
                                    value={editForm.duration}
                                    onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value) || 5})}
                                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="180"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Heure de rappel</label>
                                  <input
                                    type="time"
                                    value={editForm.scheduledTime}
                                    onChange={(e) => setEditForm({...editForm, scheduledTime: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`notifications-afternoon-${routine.id}`}
                                  checked={editForm.notificationsEnabled}
                                  onChange={(e) => setEditForm({...editForm, notificationsEnabled: e.target.checked})}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`notifications-afternoon-${routine.id}`} className="text-xs text-gray-700">
                                  Activer les notifications
                                </label>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                                >
                                  Sauvegarder
                                </button>
                                <button
                                  onClick={() => setEditingRoutine(null)}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditRoutine(routine)}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="Modifier la routine"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoutine(routine.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Supprimer la routine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {routine.isProgressive && (
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-blue-600">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evening Routines */}
        {eveningRoutines.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Routines du Soir</h3>
            </div>
            <div className="space-y-3">
              {eveningRoutines.map((routine) => (
                <div key={routine.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => onCompleteRoutine(routine.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          routine.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {routine.completed && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{routine.icon}</span>
                          <h4 className={`font-medium ${routine.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {routine.title}
                          </h4>
                          <span className="text-sm text-gray-500">({routine.duration} min)</span>
                          {routine.isProgressive && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              Semaine {routine.week}/{routine.maxWeeks}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
                        
                        {/* Edit Form */}
                        {editingRoutine === routine.id && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-3">Modifier la routine</h4>
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="Titre de la routine"
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                rows={2}
                                placeholder="Description"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Durée (minutes)</label>
                                  <input
                                    type="number"
                                    value={editForm.duration}
                                    onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value) || 5})}
                                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="180"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Heure de rappel</label>
                                  <input
                                    type="time"
                                    value={editForm.scheduledTime}
                                    onChange={(e) => setEditForm({...editForm, scheduledTime: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`notifications-evening-${routine.id}`}
                                  checked={editForm.notificationsEnabled}
                                  onChange={(e) => setEditForm({...editForm, notificationsEnabled: e.target.checked})}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`notifications-evening-${routine.id}`} className="text-xs text-gray-700">
                                  Activer les notifications
                                </label>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                                >
                                  Sauvegarder
                                </button>
                                <button
                                  onClick={() => setEditingRoutine(null)}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditRoutine(routine)}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="Modifier la routine"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoutine(routine.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Supprimer la routine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {routine.isProgressive && (
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-blue-600">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {routines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune routine pour le moment</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter votre première routine pour développer de bonnes habitudes.</p>
            <button
              onClick={() => setShowTemplates(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter ma première routine</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutinesTab; 