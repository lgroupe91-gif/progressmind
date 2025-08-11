import React from 'react';
import { CheckCircle, Clock, Trophy, Flame, Check, Edit3, Target } from 'lucide-react';
import { Routine } from '../types';

interface DashboardProps {
  routines: Routine[];
  onCompleteRoutine: (id: string) => void;
  onUpdateRoutineInput: (id: string, inputValue: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ routines, onCompleteRoutine, onUpdateRoutineInput }) => {
  const [editingRoutine, setEditingRoutine] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [meditationTimer, setMeditationTimer] = React.useState<{
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

  const morningRoutines = routines.filter(r => r.category === 'morning');
  const afternoonRoutines = routines.filter(r => r.category === 'afternoon');
  const eveningRoutines = routines.filter(r => r.category === 'evening');
  
  const completedToday = routines.filter(r => r.completed).length;
  const totalStreak = routines.reduce((sum, r) => sum + r.streak, 0);

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

  const handleInputSave = (routineId: string) => {
    onUpdateRoutineInput(routineId, inputValue);
    onCompleteRoutine(routineId);
    setEditingRoutine(null);
    setInputValue('');
  };

  const startEditing = (routine: Routine) => {
    setEditingRoutine(routine.id);
    setInputValue(routine.inputValue || '');
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

  const getAffirmationExamples = () => [
    "Je suis capable d'atteindre tous mes objectifs",
    "Chaque jour, je deviens une meilleure version de moi-même",
    "J'attire l'abondance et le succès dans ma vie",
    "Je mérite le bonheur et la réussite",
    "Ma confiance en moi grandit chaque jour",
    "Je suis reconnaissant(e) pour toutes les opportunités qui s'offrent à moi"
  ];

  const handleToggleRoutine = (routineId: string) => {
    onCompleteRoutine(routineId);
  };

  const renderRoutineItem = (routine: Routine) => {
    const needsInput = routine.title.includes('Gratitude') || 
                      routine.title.includes('Planification') || 
                      routine.title.includes('Affirmations');
    
    const isEditing = editingRoutine === routine.id;
    const isMeditation = routine.title.toLowerCase().includes('méditation');
    const isMeditationRunning = meditationTimer.routineId === routine.id && meditationTimer.isRunning;
    
    const getFrequencyLabel = (frequency?: string) => {
      switch (frequency) {
        case 'weekly': return '📆 Hebdo';
        case 'monthly': return '🗓️ Mensuel';
        default: return '📅 Quotidien';
      }
    };
    
    return (
      <div key={routine.id} className={`p-4 rounded-lg shadow-sm border ${
        routine.isGoalLinked 
          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200' 
          : isMeditationRunning
          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center space-x-4">
          {!isMeditation || routine.completed ? (
            <button
              onClick={() => handleToggleRoutine(routine.id)}
              disabled={needsInput && !routine.inputValue && !isEditing && !routine.completed}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                routine.completed
                  ? routine.isGoalLinked 
                    ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-400 cursor-pointer'
                    : 'bg-green-500 border-green-500 text-white hover:bg-green-400 cursor-pointer'
                  : needsInput && !routine.inputValue
                  ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                  : routine.isGoalLinked
                  ? 'border-primary-300 hover:border-primary-500 cursor-pointer'
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
              <h3 className={`font-medium ${routine.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {routine.title}
              </h3>
              {routine.isGoalLinked && (
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>Objectif</span>
                </span>
              )}
              <span className="text-sm text-gray-500">({routine.duration} min)</span>
              {routine.frequency && routine.frequency !== 'daily' && (
                <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded-full">
                  {getFrequencyLabel(routine.frequency)}
                </span>
              )}
              {routine.isProgressive && (
                <span className="text-xs bg-accent-100 text-accent-600 px-2 py-1 rounded-full">
                  Semaine {routine.week}
                </span>
              )}
              {needsInput && !isEditing && !routine.completed && (
                <button
                  onClick={() => startEditing(routine)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
            
            {/* Meditation Timer */}
            {isMeditation && !routine.completed && (
              <div className="mt-3">
                {isMeditationRunning ? (
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
            
            {/* Input field for routines that need it */}
            {needsInput && (
              <div className="mt-3">
                {isEditing ? (
                  <div className="space-y-2">
                    {routine.title.includes('Affirmations') && (
                      <div className="text-xs text-blue-600 mb-2">
                        <p className="font-medium">Exemples d'affirmations :</p>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          {getAffirmationExamples().slice(0, 3).map((example, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInputValue(example)}
                              className="text-left text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                            >
                              "• {example}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        routine.title.includes('Gratitude') ? 'Pour quoi es-tu reconnaissant(e) aujourd\'hui ?' :
                        routine.title.includes('Planification') ? 'Quelles sont tes priorités pour demain ?' :
                        routine.title.includes('Affirmations') ? 'Écris tes affirmations positives...' :
                        'Écris tes pensées...'
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInputSave(routine.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => {
                          setEditingRoutine(null);
                          setInputValue('');
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : routine.inputValue ? (
                  <div className="bg-blue-50 p-2 rounded text-sm text-gray-700 border-l-4 border-blue-400">
                    {routine.inputValue}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Clique sur ✏️ pour {routine.title.includes('Gratitude') ? 'exprimer ta gratitude' : 
                    routine.title.includes('Planification') ? 'planifier demain' : 'écrire tes affirmations'}
                  </div>
                )}
              </div>
            )}
          </div>
          {routine.streak > 0 && (
            <div className="flex items-center space-x-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">{routine.streak}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs">Terminées</p>
              <p className="text-2xl font-bold">{completedToday}/{routines.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-400 to-secondary-600 text-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs">Temps</p>
              <p className="text-2xl font-bold">{Math.floor(routines.reduce((sum, r) => sum + (r.completed ? r.duration : 0), 0) / 60)}h {routines.reduce((sum, r) => sum + (r.completed ? r.duration : 0), 0) % 60}m</p>
            </div>
            <Clock className="w-8 h-8 text-white/60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-400 to-primary-600 text-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs">Série</p>
              <p className="text-2xl font-bold">{totalStreak}</p>
            </div>
            <Flame className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </div>

      {/* Routines by Time of Day */}
      <div className="space-y-6">
        {/* Morning Routines */}
        {morningRoutines.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-warm-100 p-1.5 rounded-full">
                <span className="text-lg">🌅</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Routines du Matin</h2>
            </div>
            <div className="space-y-2">
              {morningRoutines.map(renderRoutineItem)}
            </div>
          </div>
        )}

        {/* Afternoon Routines */}
        {afternoonRoutines.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-warm-200 p-1.5 rounded-full">
                <span className="text-lg">☀️</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Routines de l'Après-midi</h2>
            </div>
            <div className="space-y-2">
              {afternoonRoutines.map(renderRoutineItem)}
            </div>
          </div>
        )}

        {/* Evening Routines */}
        {eveningRoutines.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-secondary-100 p-1.5 rounded-full">
                <span className="text-lg">🌙</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Routines du Soir</h2>
            </div>
            <div className="space-y-2">
              {eveningRoutines.map(renderRoutineItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;