import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3, PieChart, Activity, Clock } from 'lucide-react';
import { Routine, Goal, GratitudeEntry } from '../types';

interface StatsTabProps {
  routines: Routine[];
  goals: Goal[];
  gratitudeEntries: GratitudeEntry[];
}

const StatsTab: React.FC<StatsTabProps> = ({ routines, goals, gratitudeEntries }) => {
  const stats = useMemo(() => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Routine stats
    const completedToday = routines.filter(r => r.completed).length;
    const totalRoutines = routines.length;
    const completionRate = totalRoutines > 0 ? (completedToday / totalRoutines) * 100 : 0;
    
    const maxStreak = Math.max(...routines.map(r => r.streak), 0);
    const avgDuration = routines.length > 0 ? 
      routines.reduce((sum, r) => sum + r.duration, 0) / routines.length : 0;

    // Goals stats
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'in_progress').length;
    const avgProgress = goals.length > 0 ? 
      goals.reduce((sum, g) => sum + g.progress, 0) / goals.length : 0;

    // Gratitude stats
    const gratitudeThisWeek = gratitudeEntries.filter(entry => 
      new Date(entry.date) >= thisWeek
    ).length;

    // Weekly progression
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      // Simulation de données pour la démonstration
      const completed = Math.floor(Math.random() * totalRoutines);
      return {
        day: dayName,
        completed,
        total: totalRoutines,
        percentage: totalRoutines > 0 ? (completed / totalRoutines) * 100 : 0
      };
    });

    return {
      completedToday,
      totalRoutines,
      completionRate,
      maxStreak,
      avgDuration,
      completedGoals,
      inProgressGoals,
      avgProgress,
      gratitudeThisWeek,
      weeklyData
    };
  }, [routines, goals, gratitudeEntries]);

  const getCategoryStats = () => {
    const categories = {
      morning: { count: 0, completed: 0, color: 'bg-orange-500' },
      afternoon: { count: 0, completed: 0, color: 'bg-yellow-500' },
      evening: { count: 0, completed: 0, color: 'bg-indigo-500' }
    };

    routines.forEach(routine => {
      categories[routine.category].count++;
      if (routine.completed) {
        categories[routine.category].completed++;
      }
    });

    return categories;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Statistiques</h2>
        <p className="text-gray-600">Analyse de tes progrès et performances</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-1.5 rounded-full">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xl font-bold text-green-600">
              {stats.completionRate.toFixed(0)}%
            </span>
          </div>
          <h3 className="font-medium text-gray-800 text-sm">Taux de réussite</h3>
          <p className="text-xs text-gray-600">Aujourd'hui</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 p-1.5 rounded-full">
              <Activity className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-xl font-bold text-orange-600">{stats.maxStreak}</span>
          </div>
          <h3 className="font-medium text-gray-800 text-sm">Meilleure série</h3>
          <p className="text-xs text-gray-600">Jours consécutifs</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-blue-600">
              {stats.avgDuration.toFixed(0)}m
            </span>
          </div>
          <h3 className="font-medium text-gray-800 text-sm">Durée moyenne</h3>
          <p className="text-xs text-gray-600">Par routine</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-1.5 rounded-full">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xl font-bold text-purple-600">
              {stats.avgProgress.toFixed(0)}%
            </span>
          </div>
          <h3 className="font-medium text-gray-800 text-sm">Progrès objectifs</h3>
          <p className="text-xs text-gray-600">Moyenne</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span>Progression de la semaine</span>
        </h3>
        
        <div className="space-y-2">
          {stats.weeklyData.map((day, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-8 text-xs font-medium text-gray-600">{day.day}</div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${day.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-600 w-12 text-right">
                {day.completed}/{day.total}
              </div>
              <div className="text-xs font-medium text-gray-800 w-10 text-right">
                {day.percentage.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-purple-500" />
          <span>Répartition par moment</span>
        </h3>
        
        <div className="space-y-4">
          {Object.entries(categoryStats).map(([category, data]) => {
            const percentage = data.count > 0 ? (data.completed / data.count) * 100 : 0;
            const categoryLabels = {
              morning: { label: 'Matin', icon: '🌅' },
              afternoon: { label: 'Après-midi', icon: '☀️' },
              evening: { label: 'Soir', icon: '🌙' }
            };
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{categoryLabels[category as keyof typeof categoryLabels].icon}</span>
                    <span className="font-medium text-gray-800">
                      {categoryLabels[category as keyof typeof categoryLabels].label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {data.completed}/{data.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${data.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goals Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Objectifs</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Terminés</span>
              <span className="font-bold text-green-600">{stats.completedGoals}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">En cours</span>
              <span className="font-bold text-blue-600">{stats.inProgressGoals}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Progrès moyen</span>
              <span className="font-bold text-purple-600">{stats.avgProgress.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gratitude</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cette semaine</span>
              <span className="font-bold text-pink-600">{stats.gratitudeThisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total entrées</span>
              <span className="font-bold text-pink-600">{gratitudeEntries.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Constance</span>
              <span className="font-bold text-pink-600">
                {gratitudeEntries.length > 0 ? '🔥' : '💤'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Accomplissements</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm opacity-90">Premier objectif</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm opacity-90">Série de 7 jours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-sm opacity-90">100% aujourd'hui</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-sm opacity-90">Mois parfait</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;