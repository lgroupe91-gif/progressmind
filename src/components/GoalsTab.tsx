import React, { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock, Edit3, Trash2, ArrowDown, ArrowRight } from 'lucide-react';
import { Goal, Routine } from '../types';

interface GoalsTabProps {
  goals: Goal[];
  routines: Routine[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  onCreateRoutineFromGoal: (goalId: string, routine: Omit<Routine, 'id'>) => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({
  goals,
  routines,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onCreateRoutineFromGoal
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'1month' | '3months' | '6months' | '1year' | '5years'>('5years');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSmartForm, setShowSmartForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [showRoutineForm, setShowRoutineForm] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as const,
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    targetDate: ''
  });
  const [editGoal, setEditGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as const,
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    progress: 0,
    status: 'not_started' as const
  });
  const [newRoutine, setNewRoutine] = useState({
    title: '',
    description: '',
    category: 'morning' as const,
    duration: 15,
    icon: '🎯'
  });

  const timeframes = {
    '5years': { label: '5 ans', icon: '🎯', color: 'from-purple-500 to-purple-700', description: 'Vision à long terme' },
    '1year': { label: '1 an', icon: '📅', color: 'from-blue-500 to-blue-700', description: 'Objectifs annuels' },
    '6months': { label: '6 mois', icon: '🚀', color: 'from-green-500 to-green-700', description: 'Projets semestriels' },
    '3months': { label: '3 mois', icon: '⚡', color: 'from-orange-500 to-orange-700', description: 'Objectifs trimestriels' },
    '1month': { label: '1 mois', icon: '🎪', color: 'from-red-500 to-red-700', description: 'Actions mensuelles' }
  };

  const categories = {
    health: { label: 'Santé', icon: '💪', color: 'bg-green-500' },
    career: { label: 'Carrière', icon: '🚀', color: 'bg-blue-500' },
    finance: { label: 'Finance', icon: '💰', color: 'bg-yellow-500' },
    relationships: { label: 'Relations', icon: '💖', color: 'bg-pink-500' },
    personal: { label: 'Personnel', icon: '✨', color: 'bg-purple-500' },
    education: { label: 'Éducation', icon: '📚', color: 'bg-indigo-500' }
  };

  const filteredGoals = goals.filter(goal => goal.timeframe === activeTimeframe);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDate = new Date();
    
    switch (activeTimeframe) {
      case '5years':
        targetDate.setFullYear(targetDate.getFullYear() + 5);
        break;
      case '1year':
        targetDate.setFullYear(targetDate.getFullYear() + 1);
        break;
      case '6months':
        targetDate.setMonth(targetDate.getMonth() + 6);
        break;
      case '3months':
        targetDate.setMonth(targetDate.getMonth() + 3);
        break;
      case '1month':
        targetDate.setMonth(targetDate.getMonth() + 1);
        break;
    }

    onAddGoal({
      ...newGoal,
      timeframe: activeTimeframe,
      isSmartGoal: showSmartForm,
      childGoalIds: [],
      relatedRoutines: [],
      progress: 0,
      status: 'not_started',
      createdAt: new Date().toISOString(),
      targetDate: targetDate.toISOString().split('T')[0]
    });

    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      targetDate: ''
    });
    setShowAddForm(false);
    setShowSmartForm(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal.id);
    setEditGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      specific: goal.specific || '',
      measurable: goal.measurable || '',
      achievable: goal.achievable || '',
      relevant: goal.relevant || '',
      timeBound: goal.timeBound || '',
      progress: goal.progress,
      status: goal.status
    });
  };

  const handleSaveEdit = () => {
    if (editingGoal) {
      onUpdateGoal(editingGoal, editGoal);
      setEditingGoal(null);
    }
  };

  const handleCreateRoutine = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const routine = {
        ...newRoutine,
        completed: false,
        streak: 0,
        week: 1,
        maxWeeks: 1,
        color: 'bg-purple-500',
        isProgressive: false,
        isGoalLinked: true,
        linkedGoalId: goalId,
        encouragementMessage: newRoutine.encouragementMessage || 'Bravo ! Tu te rapproches de ton objectif !',
        progressionSteps: [
          { week: 1, duration: newRoutine.duration, description: newRoutine.description }
        ]
      };
      onCreateRoutineFromGoal(goalId, routine);
      setShowRoutineForm(null);
      setNewRoutine({
        title: '',
        description: '',
        category: 'morning',
        duration: 15,
        icon: '🎯',
        frequency: 'daily',
        encouragementMessage: ''
      });
    }
  };

  const createChildGoal = (parentGoal: Goal) => {
    const childTimeframes = {
      '5years': '1year',
      '1year': '6months',
      '6months': '3months',
      '3months': '1month'
    } as const;

    const childTimeframe = childTimeframes[parentGoal.timeframe as keyof typeof childTimeframes];
    if (!childTimeframe) return;

    setActiveTimeframe(childTimeframe);
    setNewGoal({
      title: `Étape vers: ${parentGoal.title}`,
      description: `Objectif dérivé de: ${parentGoal.title}`,
      category: parentGoal.category,
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      targetDate: ''
    });
    setShowAddForm(true);
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'paused': return 'En pause';
      default: return 'Pas commencé';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mes Objectifs</h2>
        <p className="text-gray-600">Planifie ton succès de 5 ans à 1 mois avec la méthode SMART</p>
      </div>

      {/* Timeframe Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-5">
          {Object.entries(timeframes).map(([key, timeframe]) => (
            <button
              key={key}
              onClick={() => setActiveTimeframe(key as any)}
              className={`p-4 text-center transition-all ${
                activeTimeframe === key
                  ? `bg-gradient-to-r ${timeframe.color} text-white`
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{timeframe.icon}</div>
              <div className="font-semibold text-sm">{timeframe.label}</div>
              <div className="text-xs opacity-75">{timeframe.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => {
            setShowAddForm(true);
            setShowSmartForm(false);
          }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Objectif Simple</span>
        </button>
        
        {activeTimeframe === '5years' && (
          <button
            onClick={() => {
              setShowAddForm(true);
              setShowSmartForm(true);
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          >
            <Target className="w-5 h-5" />
            <span>Objectif SMART 5 ans</span>
          </button>
        )}
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span>
              {showSmartForm ? 'Créer un objectif SMART à 5 ans' : `Nouvel objectif - ${timeframes[activeTimeframe].label}`}
            </span>
          </h3>
          
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre de l'objectif"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Description détaillée de l'objectif"
              value={newGoal.description}
              onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              required
            />

            {showSmartForm && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">Critères SMART</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>S</strong>pécifique - Que veux-tu accomplir exactement ?
                  </label>
                  <textarea
                    value={newGoal.specific}
                    onChange={(e) => setNewGoal({...newGoal, specific: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Ex: Créer ma propre entreprise dans le domaine du bien-être"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>M</strong>esurable - Comment mesureras-tu le succès ?
                  </label>
                  <textarea
                    value={newGoal.measurable}
                    onChange={(e) => setNewGoal({...newGoal, measurable: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Ex: Générer 100k€ de chiffre d'affaires annuel avec 50 clients réguliers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>A</strong>tteignable - Est-ce réaliste avec tes ressources ?
                  </label>
                  <textarea
                    value={newGoal.achievable}
                    onChange={(e) => setNewGoal({...newGoal, achievable: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Ex: J'ai l'expérience, les compétences et je peux investir du temps et de l'argent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>R</strong>elevant - Pourquoi est-ce important pour toi ?
                  </label>
                  <textarea
                    value={newGoal.relevant}
                    onChange={(e) => setNewGoal({...newGoal, relevant: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Ex: Cela correspond à ma passion et me donnera la liberté financière"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <strong>T</strong>emporel - Quelle est ta date limite ?
                  </label>
                  <textarea
                    value={newGoal.timeBound}
                    onChange={(e) => setNewGoal({...newGoal, timeBound: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Ex: D'ici 5 ans, avec des étapes clés chaque année"
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Créer l'objectif
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setShowSmartForm(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => {
          const category = categories[goal.category];
          const timeframe = timeframes[goal.timeframe];
          
          return (
            <div key={goal.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${timeframe.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{timeframe.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <span>{category.icon} {category.label}</span>
                        <span>•</span>
                        <span>{timeframe.label}</span>
                        {goal.isSmartGoal && <span className="bg-white/20 px-2 py-1 rounded-full text-xs">SMART</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {getStatusLabel(goal.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{goal.description}</p>

                {goal.isSmartGoal && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Critères SMART</h4>
                    <div className="space-y-2 text-sm">
                      {goal.specific && <p><strong>Spécifique:</strong> {goal.specific}</p>}
                      {goal.measurable && <p><strong>Mesurable:</strong> {goal.measurable}</p>}
                      {goal.achievable && <p><strong>Atteignable:</strong> {goal.achievable}</p>}
                      {goal.relevant && <p><strong>Relevant:</strong> {goal.relevant}</p>}
                      {goal.timeBound && <p><strong>Temporel:</strong> {goal.timeBound}</p>}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <div className="flex items-center space-x-2">
                      <span>{goal.progress}%</span>
                      {editingGoal === goal.id && (
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editGoal.progress}
                          onChange={(e) => setEditGoal({...editGoal, progress: parseInt(e.target.value)})}
                          className="w-20"
                        />
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${timeframe.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${editingGoal === goal.id ? editGoal.progress : goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {goal.timeframe !== '1month' && (
                      <button
                        onClick={() => createChildGoal(goal)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                      >
                        <ArrowDown className="w-4 h-4" />
                        <span>Créer sous-objectif</span>
                      </button>
                    )}
                    <button 
                      onClick={() => setShowRoutineForm(goal.id)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Routine quotidienne</span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditGoal(goal)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Routine Creation Form */}
                {showRoutineForm === goal.id && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-3">Créer une routine pour cet objectif</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Nom de la routine"
                        value={newRoutine.title}
                        onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                      <textarea
                        placeholder="Description de la routine"
                        value={newRoutine.description}
                        onChange={(e) => setNewRoutine({...newRoutine, description: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newRoutine.category}
                          onChange={(e) => setNewRoutine({...newRoutine, category: e.target.value as any})}
                          className="p-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="morning">🌅 Matin</option>
                          <option value="afternoon">☀️ Après-midi</option>
                          <option value="evening">🌙 Soir</option>
                        </select>
                        <select
                          value={newRoutine.frequency}
                          onChange={(e) => setNewRoutine({...newRoutine, frequency: e.target.value as any})}
                          className="p-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="daily">📅 Quotidien</option>
                          <option value="weekly">📆 Hebdomadaire</option>
                          <option value="monthly">🗓️ Mensuel</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Durée (min)"
                          value={newRoutine.duration}
                          onChange={(e) => setNewRoutine({...newRoutine, duration: parseInt(e.target.value)})}
                          className="p-2 border border-gray-300 rounded text-sm"
                          min="5"
                          max="120"
                        />
                        <input
                          type="text"
                          placeholder="Icône"
                          value={newRoutine.icon}
                          onChange={(e) => setNewRoutine({...newRoutine, icon: e.target.value})}
                          className="p-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <textarea
                        placeholder="Message d'encouragement (ex: Bravo ! Tu te rapproches de ton objectif !)"
                        value={newRoutine.encouragementMessage || 'Bravo ! Tu te rapproches de ton objectif !'}
                        onChange={(e) => setNewRoutine({...newRoutine, encouragementMessage: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCreateRoutine(goal.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Créer la routine
                        </button>
                        <button
                          onClick={() => setShowRoutineForm(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                {editingGoal === goal.id && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3">Modifier l'objectif</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editGoal.title}
                        onChange={(e) => setEditGoal({...editGoal, title: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                      <textarea
                        value={editGoal.description}
                        onChange={(e) => setEditGoal({...editGoal, description: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
                      {goal.isSmartGoal && (
                        <div className="space-y-2">
                          <textarea
                            placeholder="Spécifique"
                            value={editGoal.specific}
                            onChange={(e) => setEditGoal({...editGoal, specific: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            rows={1}
                          />
                          <textarea
                            placeholder="Mesurable"
                            value={editGoal.measurable}
                            onChange={(e) => setEditGoal({...editGoal, measurable: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            rows={1}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Échéance: {new Date(goal.targetDate).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <div className={`bg-gradient-to-r ${timeframes[activeTimeframe].color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Aucun objectif pour {timeframes[activeTimeframe].label}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTimeframe === '5years' 
              ? 'Commence par définir ta vision à 5 ans avec un objectif SMART'
              : `Crée tes objectifs à ${timeframes[activeTimeframe].label} pour structurer ton parcours`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalsTab;