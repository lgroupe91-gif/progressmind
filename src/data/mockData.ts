import { Routine, GratitudeEntry, Manifestation, MusicTrack, RoutineTemplate } from '../types';

export const extendedRoutineTemplates: RoutineTemplate[] = [
  // Morning routines
  {
    id: 'meditation',
    title: 'Méditation guidée',
    description: 'Commence ta journée avec une méditation pour centrer ton esprit',
    category: 'morning',
    icon: '🧘',
    color: 'bg-green-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 5, description: '5 minutes de méditation guidée - Respiration simple' },
      { week: 4, duration: 10, description: '10 minutes de méditation - Pleine conscience' },
      { week: 7, duration: 15, description: '15 minutes de méditation - Visualisation' },
      { week: 10, duration: 20, description: '20 minutes de méditation - Méditation libre' }
    ]
  },
  {
    id: 'water',
    title: 'Boire un grand verre d\'eau',
    description: 'Hydrate ton corps dès le réveil',
    category: 'morning',
    icon: '💧',
    color: 'bg-blue-500',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 2, description: 'Boire un grand verre d\'eau (250ml)' }
    ]
  },
  {
    id: 'stretching',
    title: 'Étirements matinaux',
    description: 'Réveille ton corps en douceur',
    category: 'morning',
    icon: '🤸',
    color: 'bg-orange-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 5, description: '5 minutes d\'étirements simples' },
      { week: 3, duration: 10, description: '10 minutes d\'étirements complets' },
      { week: 6, duration: 15, description: '15 minutes de yoga matinal' }
    ]
  },
  {
    id: 'reading',
    title: 'Lecture inspirante',
    description: 'Nourris ton esprit avec des lectures positives',
    category: 'morning',
    icon: '📚',
    color: 'bg-purple-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 10, description: '10 minutes de lecture développement personnel' },
      { week: 4, duration: 20, description: '20 minutes de lecture approfondie' },
      { week: 8, duration: 30, description: '30 minutes de lecture + prise de notes' }
    ]
  },
  {
    id: 'breakfast',
    title: 'Petit-déjeuner équilibré',
    description: 'Prends un petit-déjeuner nutritif pour bien commencer',
    category: 'morning',
    icon: '🥣',
    color: 'bg-yellow-500',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 15, description: 'Petit-déjeuner équilibré avec fruits et protéines' }
    ]
  },
  {
    id: 'affirmations',
    title: 'Affirmations positives',
    description: 'Répète des affirmations pour programmer ton subconscient positivement',
    category: 'morning',
    icon: '💪',
    color: 'bg-pink-500',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 5, description: 'Répète 3-5 affirmations positives avec conviction' }
    ]
  },
  {
    id: 'cold-shower',
    title: 'Douche froide',
    description: 'Booste ton énergie avec une douche froide',
    category: 'morning',
    icon: '🚿',
    color: 'bg-cyan-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 1, description: '30 secondes d\'eau froide en fin de douche' },
      { week: 3, duration: 2, description: '1 minute d\'eau froide' },
      { week: 6, duration: 3, description: '2-3 minutes de douche froide complète' }
    ]
  },

  // Nutrition routines
  {
    id: 'fruits-vegetables',
    title: 'Fruits et légumes',
    description: 'Consomme tes portions quotidiennes de fruits et légumes',
    category: 'afternoon',
    icon: '🥗',
    color: 'bg-green-600',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 5, description: 'Manger au moins 3 portions de fruits/légumes' }
    ]
  },
  {
    id: 'intermittent-fasting',
    title: 'Jeûne intermittent',
    description: 'Pratique le jeûne intermittent pour optimiser ta santé',
    category: 'morning',
    icon: '⏰',
    color: 'bg-amber-600',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 720, description: 'Jeûne 12h (ex: 20h-8h)' },
      { week: 3, duration: 840, description: 'Jeûne 14h (ex: 20h-10h)' },
      { week: 6, duration: 960, description: 'Jeûne 16h (ex: 20h-12h)' }
    ]
  },
  {
    id: 'gratitude-morning',
    title: 'Gratitude matinale',
    description: 'Exprime ta gratitude pour commencer la journée positivement',
    category: 'morning',
    icon: '🙏',
    color: 'bg-rose-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 3, description: '1 élément de gratitude' },
      { week: 4, duration: 5, description: '2 éléments de gratitude' },
      { week: 7, duration: 7, description: '3 éléments de gratitude' }
    ]
  },
  {
    id: 'gratitude-evening',
    title: 'Gratitude du soir',
    description: 'Termine ta journée en exprimant ta reconnaissance',
    category: 'evening',
    icon: '🙏',
    color: 'bg-rose-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 3, description: '1 élément de gratitude' },
      { week: 4, duration: 5, description: '2 éléments de gratitude' },
      { week: 7, duration: 7, description: '3 éléments de gratitude' }
    ]
  },

  // Afternoon routines
  {
    id: 'walk',
    title: 'Marche énergisante',
    description: 'Prends l\'air et bouge ton corps',
    category: 'afternoon',
    icon: '🚶',
    color: 'bg-green-600',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 10, description: '10 minutes de marche tranquille' },
      { week: 3, duration: 20, description: '20 minutes de marche active' },
      { week: 6, duration: 30, description: '30 minutes de marche ou jogging léger' }
    ]
  },
  {
    id: 'workout',
    title: 'Exercice physique',
    description: 'Renforce ton corps et ton mental',
    category: 'afternoon',
    icon: '💪',
    color: 'bg-red-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 15, description: '15 minutes d\'exercices simples' },
      { week: 4, duration: 25, description: '25 minutes d\'entraînement structuré' },
      { week: 8, duration: 40, description: '40 minutes d\'entraînement complet' }
    ]
  },
  {
    id: 'project',
    title: 'Travail sur projet personnel',
    description: 'Avance sur tes objectifs importants',
    category: 'afternoon',
    icon: '🎯',
    color: 'bg-indigo-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 20, description: '20 minutes sur ton projet principal' },
      { week: 3, duration: 30, description: '30 minutes de travail focalisé' },
      { week: 6, duration: 45, description: '45 minutes de deep work' }
    ]
  },
  {
    id: 'cleaning',
    title: 'Rangement/Ménage',
    description: 'Maintiens un environnement ordonné',
    category: 'afternoon',
    icon: '🧹',
    color: 'bg-yellow-500',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 15, description: '15 minutes de rangement quotidien' }
    ]
  },
  {
    id: 'learning',
    title: 'Apprentissage/Formation',
    description: 'Développe tes compétences chaque jour',
    category: 'afternoon',
    icon: '🎓',
    color: 'bg-blue-600',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 15, description: '15 minutes d\'apprentissage' },
      { week: 4, duration: 30, description: '30 minutes de formation approfondie' },
      { week: 8, duration: 45, description: '45 minutes d\'étude intensive' }
    ]
  },
  {
    id: 'cooking',
    title: 'Cuisine maison',
    description: 'Prépare un repas sain et fait maison',
    category: 'afternoon',
    icon: '👨‍🍳',
    color: 'bg-orange-600',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 30, description: 'Préparer un repas équilibré maison' }
    ]
  },
  {
    id: 'social-media-break',
    title: 'Pause réseaux sociaux',
    description: 'Déconnecte-toi des écrans pendant l\'après-midi',
    category: 'afternoon',
    icon: '📵',
    color: 'bg-gray-600',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 30, description: '30 minutes sans réseaux sociaux' },
      { week: 3, duration: 60, description: '1 heure de déconnexion' },
      { week: 6, duration: 120, description: '2 heures sans écrans' }
    ]
  },
  {
    id: 'nature',
    title: 'Contact avec la nature',
    description: 'Passe du temps dehors, dans un parc ou jardin',
    category: 'afternoon',
    icon: '🌳',
    color: 'bg-green-700',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 20, description: '20 minutes dans la nature' }
    ]
  },

  // Evening routines
  {
    id: 'family-time',
    title: 'Temps en famille',
    description: 'Connecte-toi avec tes proches',
    category: 'evening',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-pink-500',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 30, description: '30 minutes de qualité avec la famille' }
    ]
  },
  {
    id: 'planning',
    title: 'Planification du lendemain',
    description: 'Prépare ta journée suivante',
    category: 'evening',
    icon: '📅',
    color: 'bg-blue-600',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 10, description: '10 minutes de planification' }
    ]
  },
  {
    id: 'digital-detox',
    title: 'Déconnexion digitale',
    description: 'Éteins les écrans 1h avant le coucher',
    category: 'evening',
    icon: '📱',
    color: 'bg-gray-500',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 60, description: 'Pas d\'écrans 1h avant le coucher' }
    ]
  },
  {
    id: 'evening-routine',
    title: 'Routine du soir',
    description: 'Prépare-toi pour une nuit réparatrice',
    category: 'evening',
    icon: '🌙',
    color: 'bg-indigo-600',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 20, description: 'Routine relaxante avant le coucher' }
    ]
  },
  {
    id: 'journaling',
    title: 'Écriture/Journal',
    description: 'Écris tes pensées et réflexions du jour',
    category: 'evening',
    icon: '📝',
    color: 'bg-purple-600',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 10, description: '10 minutes d\'écriture libre' }
    ]
  },
  {
    id: 'tea-time',
    title: 'Tisane relaxante',
    description: 'Savoure une tisane apaisante',
    category: 'evening',
    icon: '🍵',
    color: 'bg-green-500',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 15, description: 'Moment tisane en pleine conscience' }
    ]
  },
  {
    id: 'stretching-evening',
    title: 'Étirements du soir',
    description: 'Détends tes muscles avant le coucher',
    category: 'evening',
    icon: '🧘‍♀️',
    color: 'bg-teal-500',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 5, description: '5 minutes d\'étirements doux' },
      { week: 4, duration: 10, description: '10 minutes de yoga relaxant' },
      { week: 8, duration: 15, description: '15 minutes de stretching complet' }
    ]
  },
  {
    id: 'reading-evening',
    title: 'Lecture du soir',
    description: 'Lis quelques pages avant de dormir',
    category: 'evening',
    icon: '📖',
    color: 'bg-amber-600',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 10, description: '10 minutes de lecture relaxante' },
      { week: 4, duration: 20, description: '20 minutes de lecture' },
      { week: 8, duration: 30, description: '30 minutes de lecture approfondie' }
    ]
  }
];

export const routineTemplates: RoutineTemplate[] = [
  ...extendedRoutineTemplates
];

export const initialRoutines: Routine[] = [
  {
    id: '1',
    title: 'Méditation guidée',
    description: '5 minutes de méditation guidée - Respiration simple',
    category: 'morning',
    duration: 5,
    completed: false,
    streak: 0,
    week: 1,
    maxWeeks: 10,
    color: 'bg-green-500',
    icon: '🧘',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 5, description: '5 minutes de méditation guidée - Respiration simple' },
      { week: 4, duration: 10, description: '10 minutes de méditation - Pleine conscience' },
      { week: 7, duration: 15, description: '15 minutes de méditation - Visualisation' },
      { week: 10, duration: 20, description: '20 minutes de méditation - Méditation libre' }
    ]
  },
  {
    id: '2',
    title: 'Marche énergisante',
    description: '10 minutes de marche tranquille',
    category: 'afternoon',
    duration: 10,
    completed: false,
    streak: 0,
    week: 1,
    maxWeeks: 6,
    color: 'bg-green-600',
    icon: '🚶',
    isProgressive: true,
    progressionSteps: [
      { week: 1, duration: 10, description: '10 minutes de marche tranquille' },
      { week: 3, duration: 20, description: '20 minutes de marche active' },
      { week: 6, duration: 30, description: '30 minutes de marche ou jogging léger' }
    ]
  },
  {
    id: '3',
    title: 'Planification du lendemain',
    description: '10 minutes de planification',
    category: 'evening',
    duration: 10,
    completed: false,
    streak: 0,
    week: 1,
    maxWeeks: 1,
    color: 'bg-blue-600',
    icon: '📅',
    isProgressive: false,
    progressionSteps: [
      { week: 1, duration: 10, description: '10 minutes de planification' }
    ]
  }
];

export const initialGratitudeEntries: GratitudeEntry[] = [
  {
    id: '1',
    date: '2025-01-20',
    entries: [
      'Ma famille qui me soutient toujours'
    ],
    week: 1
  }
];

export const gratitudeExamples = [
  'Ma santé qui me permet de vivre pleinement',
  'Un moment de rire partagé avec un proche',
  'Le confort de mon foyer',
  'Une compétence que j\'ai développée',
  'Un acte de gentillesse reçu ou donné',
  'La beauté de la nature qui m\'entoure',
  'Une opportunité qui s\'est présentée',
  'Mon lit douillet après une longue journée',
  'Un repas délicieux que j\'ai savouré',
  'La technologie qui facilite ma vie',
  'Un livre ou film qui m\'a inspiré(e)',
  'La liberté de faire mes propres choix'
];

export const meditationGuides = [
  {
    week: 1,
    title: 'Respiration consciente',
    instructions: [
      'Assieds-toi confortablement, le dos droit',
      'Ferme les yeux doucement',
      'Porte ton attention sur ta respiration naturelle',
      'Inspire lentement par le nez en comptant jusqu\'à 4',
      'Expire lentement par la bouche en comptant jusqu\'à 6',
      'Si ton esprit divague, ramène-le gentiment à ta respiration',
      'Continue pendant 5 minutes'
    ]
  },
  {
    week: 4,
    title: 'Pleine conscience du corps',
    instructions: [
      'Installe-toi confortablement',
      'Ferme les yeux et respire naturellement',
      'Porte ton attention sur le sommet de ta tête',
      'Descends mentalement dans ton corps, partie par partie',
      'Observe les sensations sans les juger',
      'Si tu remarques des tensions, respire dans cette zone',
      'Termine en prenant conscience de ton corps entier'
    ]
  }
];

export const initialManifestations: Manifestation[] = [
  {
    id: '1',
    title: 'Développer une routine matinale solide',
    description: 'Je me visualise me réveillant naturellement tôt, plein(e) d\'énergie, accomplissant ma routine matinale avec joie et sérénité.',
    category: 'personal',
    targetDate: '2025-03-01',
    visualized: false,
    createdAt: '2025-01-15'
  }
];

export const musicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    artist: 'Zen Sounds',
    duration: '5:00',
    category: 'meditation',
    url: '#'
  },
  {
    id: '2',
    title: 'Energizing Walk',
    artist: 'Nature Beats',
    duration: '10:00',
    category: 'energy',
    url: '#'
  },
  {
    id: '3',
    title: 'Evening Reflection',
    artist: 'Peaceful Minds',
    duration: '8:00',
    category: 'meditation',
    url: '#'
  }
];