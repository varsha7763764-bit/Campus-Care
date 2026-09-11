import { useState } from 'react';
import {
  Pill,
  Sun,
  Cloud,
  Sunset,
  Moon,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  Trash2,
  CalendarDays,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, ProgressRing } from '@/components/ui';
import type { RoutineMedicine } from '@/types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = [
  { key: 'Morning' as const, label: 'Morning', icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'Afternoon' as const, label: 'Afternoon', icon: Cloud, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { key: 'Evening' as const, label: 'Evening', icon: Sunset, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { key: 'Night' as const, label: 'Night', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
];

export function MedicalRoutine() {
  const { routine, markAsTaken, removeFromRoutine, currentDay } = useApp();
  const [selectedDay, setSelectedDay] = useState(DAYS[currentDay === 0 ? 6 : currentDay - 1]);

  const dayIndex = DAYS.indexOf(selectedDay);

  const dayMeds = routine.filter(m => m.days.includes(selectedDay));
  const takenCount = dayMeds.filter(m => m.taken[dayIndex]).length;
  const dayProgress = dayMeds.length > 0 ? (takenCount / dayMeds.length) * 100 : 0;

  const weeklyTaken = routine.reduce((sum, m) => sum + m.taken.filter((t, i) => t && m.days.includes(DAYS[i])).length, 0);
  const weeklyTotal = routine.reduce((sum, m) => sum + m.days.length, 0);
  const weeklyProgress = weeklyTotal > 0 ? (weeklyTaken / weeklyTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Medical Routine" subtitle="Your weekly medicine schedule — organized like a campus timetable" />

      {/* Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <ProgressRing progress={dayProgress} size={80} stroke={8} />
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Progress</p>
            <p className="text-2xl font-bold text-slate-800">{takenCount}/{dayMeds.length}</p>
            <p className="text-xs text-slate-400">medicines completed</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <ProgressRing progress={weeklyProgress} size={80} stroke={8} color="#4f46e5" />
          <div>
            <p className="text-sm font-medium text-slate-500">Weekly Progress</p>
            <p className="text-2xl font-bold text-slate-800">{weeklyTaken}/{weeklyTotal}</p>
            <p className="text-xs text-slate-400">total doses this week</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-success-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Adherence Rate</p>
            <p className="text-2xl font-bold text-slate-800">{Math.round(weeklyProgress)}%</p>
            <p className="text-xs text-slate-400">weekly medicine adherence</p>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((day, i) => {
          const dayMedCount = routine.filter(m => m.days.includes(day)).length;
          const dayTakenCount = routine.filter(m => m.days.includes(day) && m.taken[i]).length;
          const isToday = i === (currentDay === 0 ? 6 : currentDay - 1);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-center transition-all min-w-[80px] ${
                selectedDay === day
                  ? 'bg-primary-600 text-white shadow-soft'
                  : isToday
                  ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                  : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              <p className="text-sm font-semibold">{day}</p>
              <p className="text-xs opacity-70 mt-0.5">{dayTakenCount}/{dayMedCount}</p>
            </button>
          );
        })}
      </div>

      {/* Weekly Timetable */}
      <div className="card p-5 overflow-x-auto">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary-600" />
          Weekly Schedule — {selectedDay}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[600px] lg:min-w-0">
          {SLOTS.map(slot => {
            const slotMeds = dayMeds.filter(m => m.slot === slot.key);
            const Icon = slot.icon;
            return (
              <div key={slot.key} className={`rounded-2xl border-2 ${slot.border} ${slot.bg} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${slot.color}`} />
                  <h4 className="font-semibold text-slate-700">{slot.label}</h4>
                  <span className="ml-auto text-xs text-slate-400 font-medium">{slotMeds.length} meds</span>
                </div>
                {slotMeds.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No medicines scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {slotMeds.map(med => {
                      const isTaken = med.taken[dayIndex];
                      return (
                        <div
                          key={med.id}
                          className={`bg-white rounded-xl p-3 border transition-all ${
                            isTaken ? 'border-success-200 bg-success-50/50' : 'border-slate-100'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Pill className={`w-3.5 h-3.5 flex-shrink-0 ${isTaken ? 'text-success-500' : 'text-slate-400'}`} />
                                <p className={`text-sm font-medium truncate ${isTaken ? 'text-success-700 line-through' : 'text-slate-800'}`}>
                                  {med.name}
                                </p>
                              </div>
                              <p className="text-xs text-slate-400 ml-5 mt-0.5">{med.dosage}</p>
                              <div className="flex items-center gap-1 mt-1.5 ml-5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-500">{med.time}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => markAsTaken(med.id, dayIndex)}
                              className={`flex-shrink-0 transition-all hover:scale-110 ${isTaken ? 'text-success-600' : 'text-slate-300 hover:text-slate-500'}`}
                            >
                              {isTaken ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className={`text-[10px] font-medium ${isTaken ? 'text-success-600' : 'text-slate-400'}`}>
                              {isTaken ? 'Taken' : 'Upcoming'}
                            </span>
                            <button
                              onClick={() => removeFromRoutine(med.id)}
                              className="text-slate-300 hover:text-danger-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Week Overview Table */}
      <div className="card p-5 overflow-x-auto">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Pill className="w-4 h-4 text-primary-600" />
          All Medicines Overview
        </h3>
        <div className="min-w-[700px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-400 py-2 px-3">Medicine</th>
                <th className="text-left text-xs font-semibold text-slate-400 py-2 px-3">Slot</th>
                <th className="text-left text-xs font-semibold text-slate-400 py-2 px-3">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="text-center text-xs font-semibold text-slate-400 py-2 px-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routine.map(med => (
                <tr key={med.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="text-sm font-medium text-slate-700">{med.name}</p>
                    <p className="text-xs text-slate-400">{med.dosage}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-500">{med.slot}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-500">{med.time}</span>
                  </td>
                  {DAYS.map((day, i) => {
                    const isScheduled = med.days.includes(day);
                    const isTaken = isScheduled && med.taken[i];
                    return (
                      <td key={day} className="py-3 px-2 text-center">
                        {isScheduled ? (
                          <button
                            onClick={() => markAsTaken(med.id, i)}
                            className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all ${
                              isTaken ? 'bg-success-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {isTaken && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        ) : (
                          <span className="text-slate-200 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
