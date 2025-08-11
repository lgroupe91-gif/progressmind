import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import RoutinesTab from './components/RoutinesTab';
import GoalsTab from './components/GoalsTab';
import GratitudeTab from './components/GratitudeTab';
import ManifestationTab from './components/ManifestationTab';
import MusicTab from './components/MusicTab';
import NotesTab from './components/NotesTab';
import CalendarTab from './components/CalendarTab';
import StatsTab from './components/StatsTab';
import NotificationSettings from './components/NotificationSettings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotifications } from './hooks/useNotifications';
import { Routine, Note, MusicTrack, Goal, GratitudeEntry, Manifestation } from './types';
import { 
  initialRoutines, 
  musicTracks,
  initialGratitudeEntries,
  initialManifestations
} from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', initialRoutines);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [tracks, setTracks] = useLocalStorage<MusicTrack[]>('musicTracks', musicTracks);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [gratitudeEntries, setGratitudeEntries] = useLocalStorage<GratitudeEntry[]>('gratitudeEntries', initialGratitudeEntries);
  const [manifestations, setManifestations] = useLocalStorage<Manifestation[]>('manifestations', initialManifestations);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  
  const userName = "Alex";
  const currentStreak = routines.reduce((max, routine) => Math.max(max, routine.streak), 0);

  // Initialize notifications
  useNotifications(routines);

  const handleCompleteRoutine = (id: string) => {
    setRoutines(routines.map(routine => {
      if (routine.id === id) {
        if (routine.completed) {
          // Décocher la routine
          return { 
            ...routine, 
            completed: false, 
            streak: Math.max(0, routine.streak - 1) 
          };
        } else {
          // Cocher la routine
          return { 
            ...routine, 
            completed: true, 
            streak: routine.streak + 1 
          };
        }
      }
      return routine;
    }));
  };

  const handleUpdateRoutineInput = (id: string, inputValue: string) => {
    setRoutines(routines.map(routine => 
      routine.id === id 
        ? { ...routine, inputValue }
        : routine
    ));
  };

  const handleAddRoutine = (newRoutine: Omit<Routine, 'id'>) => {
    const routine: Routine = {
      ...newRoutine,
      id: Date.now().toString()
    };
    setRoutines([...routines, routine]);
  };

  const handleEditRoutine = (id: string, updates: Partial<Routine>) => {
    setRoutines(routines.map(routine => 
      routine.id === id ? { ...routine, ...updates } : routine
    ));
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(routines.filter(routine => routine.id !== id));
  };

  const handleAddTrack = (track: Omit<MusicTrack, 'id'>) => {
    const newTrack: MusicTrack = {
      ...track,
      id: Date.now().toString()
    };
    setTracks([...tracks, newTrack]);
  };

  const handleAddNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString()
    };
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString()
    };
    setGoals([...goals, goal]);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleCreateRoutineFromGoal = (goalId: string, routine: Omit<Routine, 'id'>) => {
    handleAddRoutine(routine);
    // Link the routine to the goal
    handleUpdateGoal(goalId, {
      relatedRoutines: [...(goals.find(g => g.id === goalId)?.relatedRoutines || []), Date.now().toString()]
    });
  };

  const handleAddGratitudeEntry = (entry: Omit<GratitudeEntry, 'id'>) => {
    const newEntry: GratitudeEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setGratitudeEntries([newEntry, ...gratitudeEntries]);
  };

  const handleAddManifestation = (manifestation: Omit<Manifestation, 'id'>) => {
    const newManifestation: Manifestation = {
      ...manifestation,
      id: Date.now().toString()
    };
    setManifestations([newManifestation, ...manifestations]);
  };

  const handleVisualizeManifestation = (id: string) => {
    setManifestations(manifestations.map(m => 
      m.id === id ? { ...m, visualized: true } : m
    ));
  };
  // Handle routine progression
  React.useEffect(() => {
    const checkProgression = () => {
      setRoutines(currentRoutines => 
        currentRoutines.map(routine => {
          if (routine.isProgressive && routine.streak > 0 && routine.streak % 21 === 0) {
            // Every 3 weeks (21 days), check for progression
            const nextStep = routine.progressionSteps.find(step => step.week > routine.week);
            if (nextStep) {
              return {
                ...routine,
                week: nextStep.week,
                duration: nextStep.duration,
                description: nextStep.description
              };
            }
          }
          return routine;
        })
      );
    };

    checkProgression();
  }, [routines]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            routines={routines} 
            onCompleteRoutine={handleCompleteRoutine}
            onUpdateRoutineInput={handleUpdateRoutineInput}
          />
        );
      case 'routines':
        return (
          <RoutinesTab
            routines={routines}
            onAddRoutine={handleAddRoutine}
            onEditRoutine={handleEditRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onCompleteRoutine={handleCompleteRoutine}
          />
        );
      case 'goals':
        return (
          <GoalsTab
            goals={goals}
            routines={routines}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
            onCreateRoutineFromGoal={handleCreateRoutineFromGoal}
          />
        );
      case 'manifestation':
        return (
          <ManifestationTab
            manifestations={manifestations}
            onAddManifestation={handleAddManifestation}
            onVisualizeManifestation={handleVisualizeManifestation}
          />
        );
      case 'music':
        return <MusicTab tracks={tracks} onAddTrack={handleAddTrack} />;
      case 'notes':
        return (
          <NotesTab
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        );
      case 'calendar':
        return <CalendarTab routines={routines} />;
      case 'stats':
        return (
          <StatsTab 
            routines={routines}
            goals={goals}
            gratitudeEntries={gratitudeEntries}
          />
        );
      default:
        return (
          <Dashboard 
            routines={routines} 
            onCompleteRoutine={handleCompleteRoutine}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header 
        userName={userName} 
        currentStreak={currentStreak}
        onOpenNotifications={() => setShowNotificationSettings(true)}
      />
      
      <main className="py-4 px-3">
        {renderActiveTab()}
      </main>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {showNotificationSettings && (
        <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
      )}
    </div>
  );
}

export default App;