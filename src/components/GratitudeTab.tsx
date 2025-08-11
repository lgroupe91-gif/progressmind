import React, { useState } from 'react';
import { Heart, Plus, Calendar, Sparkles, Lightbulb, RefreshCw } from 'lucide-react';
import { GratitudeEntry } from '../types';
import { gratitudeExamples } from '../data/mockData';

interface GratitudeTabProps {
  gratitudeEntries: GratitudeEntry[];
  onAddEntry: (entry: Omit<GratitudeEntry, 'id'>) => void;
}

const GratitudeTab: React.FC<GratitudeTabProps> = ({ gratitudeEntries, onAddEntry }) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [newEntries, setNewEntries] = useState(['']);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showExamples, setShowExamples] = useState(false);
  const [currentExamples, setCurrentExamples] = useState<string[]>([]);

  // Determine number of entries based on week progression
  const getMaxEntries = (week: number) => {
    if (week <= 3) return 1;
    if (week <= 6) return 2;
    return 3;
  };

  const maxEntries = getMaxEntries(currentWeek);

  // Initialize entries array based on current week
  React.useEffect(() => {
    const entriesArray = Array(maxEntries).fill('');
    setNewEntries(entriesArray);
  }, [maxEntries]);

  const getRandomExamples = () => {
    const shuffled = [...gratitudeExamples].sort(() => 0.5 - Math.random());
    setCurrentExamples(shuffled.slice(0, 6));
  };

  React.useEffect(() => {
    getRandomExamples();
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const validEntries = newEntries.filter(entry => entry.trim() !== '');
    if (validEntries.length > 0) {
      onAddEntry({
        date: selectedDate,
        entries: validEntries,
        week: currentWeek
      });
      setNewEntries(Array(maxEntries).fill(''));
    }
  };

  const useExample = (example: string) => {
    const firstEmptyIndex = newEntries.findIndex(entry => entry.trim() === '');
    if (firstEmptyIndex !== -1) {
      const updated = [...newEntries];
      updated[firstEmptyIndex] = example;
      setNewEntries(updated);
    }
  };

  const getTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return gratitudeEntries.find(entry => entry.date === today);
  };

  const todayEntry = getTodayEntry();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Journal de Gratitude</h2>
        <p className="text-gray-600">Cultive la reconnaissance et attire l'abondance dans ta vie</p>
        
        {/* Week Progression Indicator */}
        <div className="mt-4 inline-flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-full">
          <span className="text-sm text-pink-600 font-medium">
            Semaine {currentWeek} - {maxEntries} élément{maxEntries > 1 ? 's' : ''} de gratitude par jour
          </span>
        </div>
      </div>

      {/* Today's Entry Form */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <span>Ce soir, je suis reconnaissant(e) pour...</span>
        </h3>
        
        {todayEntry ? (
          <div className="space-y-3">
            {todayEntry.entries.map((entry, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                <p className="text-gray-700">{entry}</p>
              </div>
            ))}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Gratitude exprimée aujourd'hui ✨</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleAddEntry} className="space-y-4">
              {newEntries.map((entry, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    value={entry}
                    onChange={(e) => {
                      const updated = [...newEntries];
                      updated[index] = e.target.value;
                      setNewEntries(updated);
                    }}
                    className="w-full p-4 bg-white border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={maxEntries === 1 ? 'Pour quoi es-tu reconnaissant(e) aujourd\'hui ?' : `Élément de gratitude ${index + 1}...`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
              ))}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Exprimer ma gratitude
              </button>
            </form>

            {/* Examples Section */}
            <div className="mt-6 pt-4 border-t border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Besoin d'inspiration ?</span>
                </button>
                {showExamples && (
                  <button
                    onClick={getRandomExamples}
                    className="text-pink-600 hover:text-pink-700 p-1"
                    title="Nouveaux exemples"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {showExamples && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => useExample(example)}
                      className="text-left p-3 bg-white border border-pink-100 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-sm text-gray-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progression Guide */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">📈 Progression de la Gratitude</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Semaines 1-3:</strong> 1 élément de gratitude par jour (pour créer l'habitude)</p>
          <p><strong>Semaines 4-6:</strong> 2 éléments par jour (approfondir la pratique)</p>
          <p><strong>Semaine 7+:</strong> 3 éléments par jour (maîtrise complète)</p>
        </div>
      </div>

      {/* Previous Entries */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span>Mes moments de gratitude</span>
        </h3>
        
        <div className="space-y-4">
          {gratitudeEntries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Semaine {entry.week}
                  </span>
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-500" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {new Date(entry.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="text-pink-500 text-sm font-medium">
                  {entry.entries.length} élément{entry.entries.length > 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="space-y-2">
                {entry.entries.map((gratitudeItem, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{gratitudeItem}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GratitudeTab;