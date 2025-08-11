import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Trophy, Flame } from 'lucide-react';
import { Routine } from '../types';

interface CalendarTabProps {
  routines: Routine[];
}

const CalendarTab: React.FC<CalendarTabProps> = ({ routines }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getCompletionRate = (day: number) => {
    // Simulation plus réaliste basée sur la date
    const today = new Date();
    const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Ne pas afficher de données pour les jours futurs
    if (currentDay > today) {
      return { completed: 0, total: routines.length };
    }
    
    // Simulation basée sur le jour pour avoir des données cohérentes
    const seed = currentDay.getTime();
    const random = Math.sin(seed) * 10000;
    const completedRoutines = Math.floor((Math.abs(random) % (routines.length + 1)));
    const totalRoutines = routines.length;
    
    return { completed: completedRoutines, total: totalRoutines };
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const { completed, total } = getCompletionRate(day);
      const completionPercentage = (completed / total) * 100;
      
      days.push(
        <div
          key={day}
          className={`p-2 border border-gray-100 min-h-[80px] relative ${
            isToday(day) ? 'bg-purple-50 border-purple-200' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday(day) ? 'text-purple-600' : 'text-gray-700'
            }`}>
              {day}
            </span>
            {isToday(day) && (
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            )}
          </div>
          
          {/* Progress indicators - only show for past and current days */}
          {new Date(currentDate.getFullYear(), currentDate.getMonth(), day) <= new Date() && (
            <div className="space-y-1">
              <div className="flex space-x-1 flex-wrap">
                {Array.from({ length: Math.min(total, 6) }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < completed ? 'bg-green-400' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
                {total > 6 && (
                  <span className="text-xs text-gray-500">+{total - 6}</span>
                )}
              </div>
              
              {completionPercentage === 100 && total > 0 && (
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  <Flame className="w-3 h-3 text-orange-500" />
                </div>
              )}
            </div>
          )}
          
          <div className="absolute bottom-1 right-1">
            {new Date(currentDate.getFullYear(), currentDate.getMonth(), day) <= new Date() && (
              <span className="text-xs text-gray-500">{completed}/{total}</span>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendrier de Progression</h2>
        <p className="text-gray-600">Visualise ta constance et tes victoires quotidiennes</p>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <button
              onClick={nextMonth}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-200">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {renderCalendar()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">Jours parfaits</h4>
          <p className="text-2xl font-bold text-green-600">
            {(() => {
              const today = new Date();
              const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
              
              let perfectDays = 0;
              for (let d = new Date(firstDay); d <= Math.min(lastDay, today); d.setDate(d.getDate() + 1)) {
                const { completed, total } = getCompletionRate(d.getDate());
                if (completed === total && total > 0) {
                  perfectDays++;
                }
              }
              return perfectDays;
            })()}
          </p>
          <p className="text-sm text-gray-600">Ce mois-ci</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">Série actuelle</h4>
          <p className="text-2xl font-bold text-orange-600">
            {Math.max(...routines.map(r => r.streak), 0)}
          </p>
          <p className="text-sm text-gray-600">Jours consécutifs</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">Constance</h4>
          <p className="text-2xl font-bold text-purple-600">
            {(() => {
              if (routines.length === 0) return 0;
              const today = new Date();
              const thirtyDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
              
              let totalDays = 0;
              let completedDays = 0;
              
              for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
                totalDays++;
                // Utiliser la même logique que getCompletionRate
                const seed = d.getTime();
                const random = Math.sin(seed) * 10000;
                const completedRoutines = Math.floor((Math.abs(random) % (routines.length + 1)));
                const completionRate = completedRoutines / routines.length;
                
                if (completionRate > 0.7) completedDays++;
              }
              
              return Math.round((completedDays / totalDays) * 100);
            })()}%
          </p>
          <p className="text-sm text-gray-600">30 derniers jours</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;