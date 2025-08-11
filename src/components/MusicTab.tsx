import React, { useState } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Plus } from 'lucide-react';
import { MusicTrack } from '../types';

interface MusicTabProps {
  tracks: MusicTrack[];
  onAddTrack: (track: Omit<MusicTrack, 'id'>) => void;
}

const MusicTab: React.FC<MusicTabProps> = ({ tracks, onAddTrack }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    duration: '',
    category: 'motivation' as const,
    url: ''
  });

  const categories = {
    all: { label: 'Toutes', icon: '🎵' },
    motivation: { label: 'Motivation', icon: '💪' },
    focus: { label: 'Concentration', icon: '🎯' },
    meditation: { label: 'Méditation', icon: '🧘' },
    energy: { label: 'Énergie', icon: '⚡' }
  };

  const filteredTracks = selectedCategory === 'all' 
    ? tracks 
    : tracks.filter(track => track.category === selectedCategory);

  const togglePlayPause = (track?: MusicTrack) => {
    if (track) {
      setCurrentTrack(track);
    }
    setIsPlaying(!isPlaying);
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTrack({
      ...newTrack,
      isCustom: true
    });
    setNewTrack({
      title: '',
      artist: '',
      duration: '',
      category: 'motivation',
      url: ''
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Musique Motivante</h2>
        <p className="text-gray-600">Laisse la musique élever ton énergie et ton mindset</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-2 shadow-md border">
          <div className="flex space-x-2">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === key
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Track Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter une musique</span>
        </button>
      </div>

      {/* Add Track Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Music className="w-5 h-5 text-purple-500" />
            <span>Ajouter une nouvelle musique</span>
          </h3>
          
          <form onSubmit={handleAddTrack} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre de la musique"
                value={newTrack.title}
                onChange={(e) => setNewTrack({...newTrack, title: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Artiste"
                value={newTrack.artist}
                onChange={(e) => setNewTrack({...newTrack, artist: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Durée (ex: 3:45)"
                value={newTrack.duration}
                onChange={(e) => setNewTrack({...newTrack, duration: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <select
                value={newTrack.category}
                onChange={(e) => setNewTrack({...newTrack, category: e.target.value as any})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, cat]) => (
                  <option key={key} value={key}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            
            <input
              type="url"
              placeholder="URL de la musique (optionnel)"
              value={newTrack.url}
              onChange={(e) => setNewTrack({...newTrack, url: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Ajouter
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

      {/* Current Playing */}
      {currentTrack && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Music className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                <p className="text-purple-100">{currentTrack.artist}</p>
                <p className="text-sm text-purple-200">{currentTrack.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                onClick={() => togglePlayPause()}
                className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-1/3 transition-all duration-300"></div>
            </div>
            <div className="flex justify-between text-sm text-purple-100 mt-2">
              <span>1:23</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tracks List */}
      <div className="space-y-4">
        {filteredTracks.map((track) => (
          <div 
            key={track.id} 
            className={`bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all cursor-pointer ${
              currentTrack?.id === track.id ? 'ring-2 ring-purple-500 border-purple-200' : ''
            }`}
            onClick={() => setCurrentTrack(track)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  track.category === 'motivation' ? 'bg-red-100 text-red-600' :
                  track.category === 'focus' ? 'bg-blue-100 text-blue-600' :
                  track.category === 'meditation' ? 'bg-green-100 text-green-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{track.title}</h4>
                  <p className="text-gray-600 text-sm">{track.artist}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      {categories[track.category as keyof typeof categories]?.label}
                    </span>
                    <span className="text-xs text-gray-500">{track.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause(track);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
                >
                  {currentTrack?.id === track.id && isPlaying ? 
                    <Pause className="w-5 h-5" /> : 
                    <Play className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicTab;