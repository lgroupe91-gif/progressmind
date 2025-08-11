export interface Routine {
  id: string;
  title: string;
  description: string;
  category: 'morning' | 'afternoon' | 'evening';
  duration: number; // in minutes
  completed: boolean;
  streak: number;
  week: number; // Current week of progression
  maxWeeks: number; // Total weeks for this routine
  color: string;
  icon: string;
  isProgressive: boolean;
  progressionSteps: ProgressionStep[];
  requiresInput?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  isGoalLinked?: boolean;
  linkedGoalId?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  encouragementMessage?: string;
  scheduledTime?: string; // Format HH:MM pour les notifications
  notificationsEnabled?: boolean;
}

export interface ProgressionStep {
  week: number;
  duration: number;
  description: string;
}

export interface RoutineTemplate {
  id: string;
  title: string;
  description: string;
  category: 'morning' | 'afternoon' | 'evening';
  icon: string;
  color: string;
  isProgressive: boolean;
  progressionSteps: ProgressionStep[];
}

export interface GratitudeEntry {
  id: string;
  date: string;
  entries: string[];
  week: number; // Week number for progression tracking
}

export interface Manifestation {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'career' | 'relationships' | 'finance' | 'personal';
  targetDate: string;
  visualized: boolean;
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: 'motivation' | 'focus' | 'meditation' | 'energy';
  url: string;
  isCustom?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'todo';
  createdAt: string;
  updatedAt: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: '1month' | '3months' | '6months' | '1year' | '5years';
  category: 'health' | 'career' | 'finance' | 'relationships' | 'personal' | 'education';
  isSmartGoal: boolean;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  parentGoalId?: string;
  childGoalIds: string[];
  relatedRoutines: string[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  createdAt: string;
  targetDate: string;
}