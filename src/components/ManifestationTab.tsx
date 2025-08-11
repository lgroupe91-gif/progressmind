import React, { useState } from 'react';
import { Target, Star, Plus, Eye, Calendar, TrendingUp } from 'lucide-react';
import { Manifestation } from '../types';

interface ManifestationTabProps {
  manifestations: Manifestation[];
  onAddManifestation: (manifestation: Omit<Manifestation, 'id'>) => void;
  onVisualizeManifestation: (id: string) => void;
}

const ManifestationTab: React.FC<ManifestationTabProps> = ({
  manifestations,
  onAddManifestation,
  onVisualizeManifestation
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newManifestation, setNewManifestation] = useState({
    title: '',
    description: '',
    category: 'personal' as const,
    targetDate: ''
  });

  const categories = {
    health: { label: 'Santé', icon: '💪', color: 'from-green-400 to-green-600' },
    career: { label: 'Carrière', icon: '🚀', color: 'from-blue-400 to-blue-600' },
    relationships: { label: 'Relations', icon: '💖', color: 'from-pink-400 to-pink-600' },
    finance: { label: 'Finance', icon: '💰', color: 'from-yellow-400 to-yellow-600' },
    personal: { label: 'Personnel', icon: '✨', color: 'from-purple-400 to-purple-600' }
  };

  const handleAddManifestation = (e: React.FormEvent) => {
    e.preventDefault();
    onAddManifestation({
      ...newManifestation,
      visualized: false,
      createdAt: new Date().toISOString()
    });
    setNewManifestation({
      title: '',
      description: '',
      category: 'personal',
      targetDate: ''
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mes Manifestations</h2>
        <p className="text-gray-600">Visualise tes rêves et transforme-les en réalité</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Manifestation</span>
        </button>
      </div>

      {/* Add Manifestation Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-purple-500" />
            <span>Créer une nouvelle manifestation</span>
          </h3>
          
          <form onSubmit={handleAddManifestation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre de ta manifestation</label>
              <input
                type="text"
                required
                value={newManifestation.title}
                onChange={(e) => setNewManifestation({...newManifestation, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Obtenir ma promotion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée</label>
              <textarea
                required
                value={newManifestation.description}
                onChange={(e) => setNewManifestation({...newManifestation, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                placeholder="Décris en détail ton objectif, ressens les émotions, visualise le résultat..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={newManifestation.category}
                  onChange={(e) => setNewManifestation({...newManifestation, category: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date cible</label>
                <input
                  type="date"
                  value={newManifestation.targetDate}
                  onChange={(e) => setNewManifestation({...newManifestation, targetDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manifestations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manifestations.map((manifestation) => {
          const category = categories[manifestation.category];
          const daysLeft = manifestation.targetDate ? 
            Math.ceil((new Date(manifestation.targetDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

          return (
            <div key={manifestation.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`bg-gradient-to-r ${category.color} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  {manifestation.visualized && (
                    <div className="bg-white/20 p-1 rounded-full">
                      <Eye className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{manifestation.title}</h3>
                <p className="text-sm opacity-90">{category.label}</p>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{manifestation.description}</p>
                
                {daysLeft !== null && (
                  <div className="flex items-center space-x-2 mb-4 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={`font-medium ${daysLeft > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {daysLeft > 0 ? `${daysLeft} jours restants` : 'Objectif atteint!'}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => onVisualizeManifestation(manifestation.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    manifestation.visualized 
                      ? 'bg-green-100 text-green-700'
                      : `bg-gradient-to-r ${category.color} text-white hover:shadow-md`
                  }`}
                >
                  {manifestation.visualized ? (
                    <>
                      <Eye className="w-4 h-4 inline mr-2" />
                      Visualisé aujourd'hui
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Visualiser maintenant
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManifestationTab;