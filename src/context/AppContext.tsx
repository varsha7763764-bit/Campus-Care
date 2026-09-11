import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  Appointment, Prescription, RoutineMedicine, CareTeamMember, MoodEntry,
  PageKey, User, DailyTask, GamificationState,
} from '@/types';
import { demoMedicines, demoPrescriptions, badgeDefs } from '@/data/demoData';

interface AppContextValue {
  currentPage: PageKey;
  navigate: (page: PageKey, params?: Record<string, string>) => void;
  pageParams: Record<string, string>;

  // Auth
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  appointments: Appointment[];
  addAppointment: (appt: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;

  prescriptions: Prescription[];
  addPrescription: (rx: Prescription) => void;

  routine: RoutineMedicine[];
  addToRoutine: (med: Omit<RoutineMedicine, 'id' | 'taken'>) => void;
  markAsTaken: (medId: string, dayIndex: number) => void;
  removeFromRoutine: (medId: string) => void;

  careTeam: CareTeamMember[];
  addToCareTeam: (member: CareTeamMember) => void;

  moods: MoodEntry[];
  addMood: (entry: MoodEntry) => void;

  // Daily Plan
  dailyTasks: DailyTask[];
  toggleDailyTask: (taskId: string) => void;
  generateDailyPlan: () => void;

  // Gamification
  gamification: GamificationState;
  addPoints: (n: number) => void;
  checkBadges: () => void;

  currentDay: number;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayStr = () => new Date().toISOString().split('T')[0];

function generateDailyTasks(routine: RoutineMedicine[], moods: MoodEntry[]): DailyTask[] {
  const date = todayStr();
  const tasks: DailyTask[] = [];
  const todayDay = DAYS[new Date().getDay()];

  // Medicine tasks
  routine
    .filter(m => m.days.includes(todayDay))
    .forEach(m => {
      tasks.push({
        id: `med-${m.id}-${date}`,
        label: `Take ${m.name} (${m.dosage})`,
        slot: m.slot,
        type: 'medicine',
        icon: 'Pill',
        completed: false,
        date,
        source: m.id,
      });
    });

  // Wellbeing task: mood check-in
  const hasMoodToday = moods.some(m => m.date === date);
  tasks.push({
    id: `mood-${date}`,
    label: 'Daily mood check-in',
    slot: 'Morning',
    type: 'wellbeing',
    icon: 'HeartPulse',
    completed: hasMoodToday,
    date,
  });

  // Lifestyle tasks
  tasks.push({
    id: `water-${date}`,
    label: 'Drink 8 glasses of water',
    slot: 'Morning',
    type: 'lifestyle',
    icon: 'Droplets',
    completed: false,
    date,
  });
  tasks.push({
    id: `walk-${date}`,
    label: '10-minute walk',
    slot: 'Afternoon',
    type: 'lifestyle',
    icon: 'Footprints',
    completed: false,
    date,
  });
  tasks.push({
    id: `relax-${date}`,
    label: '5-minute relaxation break',
    slot: 'Evening',
    type: 'lifestyle',
    icon: 'Wind',
    completed: false,
    date,
  });
  tasks.push({
    id: `sleep-${date}`,
    label: 'Sleep by 11 PM',
    slot: 'Night',
    type: 'lifestyle',
    icon: 'Moon',
    completed: false,
    date,
  });

  // Exam stress task if mood is stressed/low
  const todayMood = moods.find(m => m.date === date);
  if (todayMood && (todayMood.mood === 'Stressed' || todayMood.mood === 'Low')) {
    tasks.push({
      id: `stress-${date}`,
      label: 'Practice 4-7-8 breathing exercise',
      slot: 'Evening',
      type: 'wellbeing',
      icon: 'Brain',
      completed: false,
      date,
    });
  }

  return tasks;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  // Auth
  const [user, setUser] = useState<User | null>(() => loadFromStorage<User | null>('cc_user', null));

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage('cc_appointments', [])
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() =>
    loadFromStorage('cc_prescriptions', demoPrescriptions)
  );
  const [routine, setRoutine] = useState<RoutineMedicine[]>(() => {
    const stored = loadFromStorage<RoutineMedicine[]>('cc_routine', []);
    if (stored.length > 0) return stored;
    return demoMedicines.map((m, i) => ({
      id: `med-${i + 1}`,
      name: m.name,
      dosage: m.dosage,
      time: m.time,
      slot: m.slot,
      days: m.days,
      duration: m.duration,
      taken: m.days.map(() => false),
    }));
  });
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(() =>
    loadFromStorage('cc_careteam', [])
  );
  const [moods, setMoods] = useState<MoodEntry[]>(() =>
    loadFromStorage('cc_moods', [])
  );

  // Daily tasks
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const stored = loadFromStorage<DailyTask[]>('cc_daily_tasks', []);
    if (stored.length > 0 && stored[0]?.date === todayStr()) return stored;
    return [];
  });

  // Gamification
  const [gamification, setGamification] = useState<GamificationState>(() =>
    loadFromStorage('cc_gamification', {
      points: 0,
      streak: 0,
      lastActiveDate: '',
      totalMedicinesTaken: 0,
      totalTasksCompleted: 0,
      earnedBadges: [],
    })
  );

  const currentDay = new Date().getDay();

  useEffect(() => { saveToStorage('cc_user', user); }, [user]);
  useEffect(() => { saveToStorage('cc_appointments', appointments); }, [appointments]);
  useEffect(() => { saveToStorage('cc_prescriptions', prescriptions); }, [prescriptions]);
  useEffect(() => { saveToStorage('cc_routine', routine); }, [routine]);
  useEffect(() => { saveToStorage('cc_careteam', careTeam); }, [careTeam]);
  useEffect(() => { saveToStorage('cc_moods', moods); }, [moods]);
  useEffect(() => { saveToStorage('cc_daily_tasks', dailyTasks); }, [dailyTasks]);
  useEffect(() => { saveToStorage('cc_gamification', gamification); }, [gamification]);

  // Auto-generate daily tasks if none for today
  useEffect(() => {
    if (dailyTasks.length === 0 || dailyTasks[0]?.date !== todayStr()) {
      const tasks = generateDailyTasks(routine, moods);
      // Preserve completion from stored tasks
      setDailyTasks(prev => {
        const oldTasks = prev.filter(t => t.date === todayStr());
        return tasks.map(t => {
          const old = oldTasks.find(o => o.id === t.id);
          return old ? { ...t, completed: old.completed } : t;
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (page: PageKey, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth functions
  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const users = loadFromStorage<User[]>('cc_users', []);
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const users = loadFromStorage<User[]>('cc_users', []);
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const newUser: User = { name, email, password };
    users.push(newUser);
    saveToStorage('cc_users', users);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const addAppointment = (appt: Appointment) => {
    setAppointments(prev => [appt, ...prev]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addPrescription = (rx: Prescription) => {
    setPrescriptions(prev => [rx, ...prev]);
  };

  const addToRoutine = (med: Omit<RoutineMedicine, 'id' | 'taken'>) => {
    const newMed: RoutineMedicine = {
      ...med,
      id: `med-${Date.now()}`,
      taken: med.days.map(() => false),
    };
    setRoutine(prev => [...prev, newMed]);
  };

  const markAsTaken = (medId: string, dayIndex: number) => {
    setRoutine(prev => {
      const updated = prev.map(m => {
        if (m.id !== medId) return m;
        const newTaken = [...m.taken];
        const wasTaken = newTaken[dayIndex];
        newTaken[dayIndex] = !newTaken[dayIndex];
        // Award points for taking medicine
        if (!wasTaken) {
          setGamification(g => {
            const newPoints = g.points + 10;
            const newTotalMeds = g.totalMedicinesTaken + 1;
            const today = todayStr();
            let newStreak = g.streak;
            if (g.lastActiveDate !== today) {
              const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
              newStreak = g.lastActiveDate === yesterday ? g.streak + 1 : 1;
            }
            return {
              ...g,
              points: newPoints,
              totalMedicinesTaken: newTotalMeds,
              streak: newStreak,
              lastActiveDate: today,
            };
          });
          // Also mark the daily plan task as completed
          setDailyTasks(tasks => tasks.map(t =>
            t.source === medId && !t.completed
              ? { ...t, completed: true }
              : t
          ));
        } else {
          setGamification(g => ({
            ...g,
            points: Math.max(0, g.points - 10),
            totalMedicinesTaken: Math.max(0, g.totalMedicinesTaken - 1),
          }));
        }
        return { ...m, taken: newTaken };
      });
      return updated;
    });
  };

  const removeFromRoutine = (medId: string) => {
    setRoutine(prev => prev.filter(m => m.id !== medId));
  };

  const addToCareTeam = (member: CareTeamMember) => {
    setCareTeam(prev => {
      const existing = prev.find(c => c.doctorId === member.doctorId);
      if (existing) {
        return prev.map(c => (c.doctorId === member.doctorId ? member : c));
      }
      return [...prev, member];
    });
  };

  const addMood = (entry: MoodEntry) => {
    setMoods(prev => {
      const filtered = prev.filter(m => m.date !== entry.date);
      return [entry, ...filtered].slice(0, 30);
    });
    // Award points for mood check-in
    setGamification(g => {
      const today = todayStr();
      let newStreak = g.streak;
      if (g.lastActiveDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        newStreak = g.lastActiveDate === yesterday ? g.streak + 1 : 1;
      }
      return {
        ...g,
        points: g.points + 5,
        streak: newStreak,
        lastActiveDate: today,
      };
    });
  };

  const toggleDailyTask = (taskId: string) => {
    setDailyTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;
      const wasCompleted = task.completed;
      const updated = prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);

      if (!wasCompleted) {
        // Award points
        setGamification(g => {
          const today = todayStr();
          let newStreak = g.streak;
          if (g.lastActiveDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            newStreak = g.lastActiveDate === yesterday ? g.streak + 1 : 1;
          }
          return {
            ...g,
            points: g.points + 5,
            totalTasksCompleted: g.totalTasksCompleted + 1,
            streak: newStreak,
            lastActiveDate: today,
          };
        });
      } else {
        setGamification(g => ({
          ...g,
          points: Math.max(0, g.points - 5),
          totalTasksCompleted: Math.max(0, g.totalTasksCompleted - 1),
        }));
      }

      // If it's a medicine task, also mark in routine
      if (task.type === 'medicine' && task.source) {
        const dayIdx = new Date().getDay();
        const dayName = DAYS[dayIdx];
        setRoutine(prevRoutine => prevRoutine.map(m => {
          if (m.id !== task.source || !m.days.includes(dayName)) return m;
          const newTaken = [...m.taken];
          const routineDayIdx = m.days.indexOf(dayName);
          // Map DAYS index to taken array index
          const takenIdx = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(dayName);
          if (takenIdx >= 0 && takenIdx < newTaken.length) {
            newTaken[takenIdx] = !wasCompleted;
          }
          void routineDayIdx;
          return { ...m, taken: newTaken };
        }));
      }

      return updated;
    });
  };

  const generateDailyPlan = () => {
    const tasks = generateDailyTasks(routine, moods);
    setDailyTasks(prev => {
      const oldTasks = prev.filter(t => t.date === todayStr());
      return tasks.map(t => {
        const old = oldTasks.find(o => o.id === t.id);
        return old ? { ...t, completed: old.completed } : t;
      });
    });
  };

  const addPoints = (n: number) => {
    setGamification(g => ({ ...g, points: g.points + n }));
  };

  const checkBadges = () => {
    setGamification(g => {
      const newBadges = [...g.earnedBadges];
      badgeDefs.forEach(badge => {
        if (newBadges.includes(badge.id)) return;
        let earned = false;
        if (badge.unit === 'points' && g.points >= badge.threshold) earned = true;
        if (badge.unit === 'streak' && g.streak >= badge.threshold) earned = true;
        if (badge.unit === 'medicines' && g.totalMedicinesTaken >= badge.threshold) earned = true;
        if (badge.unit === 'tasks' && g.totalTasksCompleted >= badge.threshold) earned = true;
        if (earned) newBadges.push(badge.id);
      });
      if (newBadges.length !== g.earnedBadges.length) {
        return { ...g, earnedBadges: newBadges };
      }
      return g;
    });
  };

  // Check badges whenever gamification changes
  useEffect(() => {
    checkBadges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamification.points, gamification.streak, gamification.totalMedicinesTaken, gamification.totalTasksCompleted]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        pageParams,
        user,
        login,
        signup,
        logout,
        appointments,
        addAppointment,
        updateAppointment,
        prescriptions,
        addPrescription,
        routine,
        addToRoutine,
        markAsTaken,
        removeFromRoutine,
        careTeam,
        addToCareTeam,
        moods,
        addMood,
        dailyTasks,
        toggleDailyTask,
        generateDailyPlan,
        gamification,
        addPoints,
        checkBadges,
        currentDay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { DAYS };
