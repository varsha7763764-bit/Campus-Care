import {
  Sun,
  Cloud,
  Sunset,
  Moon,
  CheckCircle2,
  Circle,
  Pill,
  Droplets,
  Footprints,
  Wind,
  HeartPulse,
  Brain,
  CalendarCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, ProgressRing } from '@/components/ui';

const iconMap: Record<string, typeof Sun> = {
  Pill,
  Droplets,
  Footprints,
  Wind,
  HeartPulse,
  Brain,
  Moon,
};

const SLOTS = [
  { key: 'Morning' as const, label: 'Morning', icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'Afternoon' as const, label: 'Afternoon', icon: Cloud, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { key: 'Evening' as const, label: 'Evening', icon: Sunset, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { key: 'Night' as const, label: 'Night', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
];

const typeColors: Record<string, string> = {
  medicine: 'bg-teal-100 text-teal-700',
  wellbeing: 'bg-rose-100 text-rose-700',
  lifestyle: 'bg-primary-100 text-primary-700',
};

export function DailyPlan() {
  const { dailyTasks, toggleDailyTask, gamification, navigate } = useApp();

  const completedCount = dailyTasks.filter(t => t.completed).length;
  const totalCount = dailyTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const today = new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      <PageHeader title="My Daily Health Plan" subtitle={`Personalized tasks for ${today}`} />

      {/* Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <ProgressRing progress={progress} size={80} stroke={8} />
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Progress</p>
            <p className="text-2xl font-bold text-slate-800">{completedCount}/{totalCount}</p>
            <p className="text-xs text-slate-400">tasks completed</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Health Points</p>
            <p className="text-2xl font-bold text-slate-800">{gamification.points}</p>
            <p className="text-xs text-slate-400">total earned</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{gamification.streak}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Current Streak</p>
            <p className="text-2xl font-bold text-slate-800">{gamification.streak} days</p>
            <p className="text-xs text-slate-400">keep it going!</p>
          </div>
        </div>
      </div>

      {/* Task Slots */}
      {dailyTasks.length === 0 ? (
        <div className="card p-8 text-center">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">Your daily plan will be generated automatically based on your medicines and wellbeing.</p>
          <button onClick={() => navigate('medical-routine')} className="btn-secondary text-sm">
            Set Up Medical Routine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SLOTS.map(slot => {
            const slotTasks = dailyTasks.filter(t => t.slot === slot.key);
            if (slotTasks.length === 0) return null;
            const Icon = slot.icon;
            const slotCompleted = slotTasks.filter(t => t.completed).length;
            return (
              <div key={slot.key} className={`rounded-2xl border-2 ${slot.border} ${slot.bg} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${slot.color}`} />
                  <h3 className="font-semibold text-slate-700">{slot.label}</h3>
                  <span className="ml-auto text-xs text-slate-400 font-medium">
                    {slotCompleted}/{slotTasks.length} done
                  </span>
                </div>
                <div className="space-y-2">
                  {slotTasks.map(task => {
                    const TaskIcon = iconMap[task.icon] || Circle;
                    return (
                      <div
                        key={task.id}
                        className={`bg-white rounded-xl p-3 border transition-all ${
                          task.completed ? 'border-success-200 bg-success-50/50' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleDailyTask(task.id)}
                            className={`flex-shrink-0 transition-all hover:scale-110 ${task.completed ? 'text-success-600' : 'text-slate-300 hover:text-slate-500'}`}
                          >
                            {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                          </button>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${task.completed ? 'bg-success-100' : typeColors[task.type] || 'bg-slate-100'}`}>
                            <TaskIcon className={`w-4 h-4 ${task.completed ? 'text-success-600' : ''}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${task.completed ? 'text-success-700 line-through' : 'text-slate-800'}`}>
                              {task.label}
                            </p>
                            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 ${typeColors[task.type] || 'bg-slate-100 text-slate-500'}`}>
                              {task.type}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-primary-600">+5</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="card p-5 bg-gradient-to-br from-primary-50/50 to-secondary-50/50">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1">How your plan is personalized</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your daily tasks are generated from your Medical Routine medicines, daily mood check-in, and wellbeing status.
              If you report feeling stressed or low, an extra relaxation exercise is added to your evening plan.
              Completing tasks earns health points and increases your streak — check the Rewards page to track your progress!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => navigate('medical-routine')} className="card card-hover p-4 text-left">
          <Pill className="w-6 h-6 text-teal-600 mb-2" />
          <p className="text-sm font-semibold text-slate-800">Medical Routine</p>
          <p className="text-xs text-slate-400">View your medicine schedule</p>
        </button>
        <button onClick={() => navigate('wellbeing')} className="card card-hover p-4 text-left">
          <HeartPulse className="w-6 h-6 text-rose-500 mb-2" />
          <p className="text-sm font-semibold text-slate-800">Wellbeing</p>
          <p className="text-xs text-slate-400">Mood check-in and resources</p>
        </button>
        <button onClick={() => navigate('rewards')} className="card card-hover p-4 text-left">
          <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
          <p className="text-sm font-semibold text-slate-800">Rewards</p>
          <p className="text-xs text-slate-400">View points and badges</p>
        </button>
      </div>
    </div>
  );
}
