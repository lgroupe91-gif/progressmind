import React from 'react';
import { Rocket, User, Settings, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  userName: string;
  currentStreak: number;
  onOpenNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, currentStreak, onOpenNotifications }) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">ProgressMind</h1>
            <p className="text-xs text-purple-100 hidden sm:block">De petites actions pour de grands objectifs</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-purple-100">Bonjour,</p>
            <p className="text-sm font-semibold">{userName}</p>
          </div>
          
          <div className="bg-white/20 px-2 py-1 rounded-full">
            <p className="text-xs text-purple-100 hidden sm:block">Série</p>
            <p className="text-sm font-bold text-center">🔥 {currentStreak}</p>
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={onOpenNotifications}
              className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors"
              title="Paramètres de notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors hidden sm:block">
              <User className="w-4 h-4" />
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors hidden sm:block">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;