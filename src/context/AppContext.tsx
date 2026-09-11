import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Appointment, Prescription, RoutineMedicine, CareTeamMember, MoodEntry, PageKey } from '@/types';
import { demoMedicines, demoPrescriptions } from '@/data/demoData';

interface AppContextValue {
  currentPage: PageKey;
  navigate: (page: PageKey, params?: Record<string, string>) => void;
  pageParams: Record<string, string>;

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

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

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

  const currentDay = new Date().getDay();

  useEffect(() => { saveToStorage('cc_appointments', appointments); }, [appointments]);
  useEffect(() => { saveToStorage('cc_prescriptions', prescriptions); }, [prescriptions]);
  useEffect(() => { saveToStorage('cc_routine', routine); }, [routine]);
  useEffect(() => { saveToStorage('cc_careteam', careTeam); }, [careTeam]);
  useEffect(() => { saveToStorage('cc_moods', moods); }, [moods]);

  const navigate = (page: PageKey, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setRoutine(prev =>
      prev.map(m => {
        if (m.id !== medId) return m;
        const newTaken = [...m.taken];
        newTaken[dayIndex] = !newTaken[dayIndex];
        return { ...m, taken: newTaken };
      })
    );
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
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        pageParams,
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
