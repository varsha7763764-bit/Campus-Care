import {
  Flame,
  Star,
  Award,
  Droplets,
  Moon,
  Pill,
  CalendarCheck,
  TrendingUp,
  Trophy,
  Lock,
  Target,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, ProgressRing } from '@/components/ui';
import { badgeDefs } from '@/data/demoData';

const iconMap: Record<string, typeof Flame> = {
  Flame,
  Star,
  Award,
  Droplets,
  Moon,
  Pill,
  CalendarCheck,
  Trophy,
};

export function Rewards() {
  const { gamification, routine, dailyTasks, navigate } = useApp();

  const weeklyGoal = 210;
  const weeklyProgress = Math.min((gamification.points / weeklyGoal) * 100, 100);

  const earnedBadges = badgeDefs.filter(b => gamification.earnedBadges.includes(b.id));
  const lockedBadges = badgeDefs.filter(b => !gamification.earnedBadges.includes(b.id));

  return (
    <div className="space-y-6">
      <PageHeader title="Health & Rewards" subtitle="Stay healthy, earn points, and unlock badges" />

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Health Points */}
        <div className="card p-5 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
              <Star className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Health Points</p>
              <p className="text-3xl font-bold text-slate-800">{gamification.points}</p>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="card p-5 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-soft">
              <Flame className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Health Streak</p>
              <p className="text-3xl font-bold text-slate-800">{gamification.streak} <span className="text-base font-medium text-slate-400">days</span></p>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <ProgressRing progress={weeklyProgress} size={64} stroke={7} color="#4f46e5" />
            <div>
              <p className="text-sm text-slate-500 font-medium">Weekly Goal</p>
              <p className="text-2xl font-bold text-slate-800">{gamification.points}/{weeklyGoal}</p>
              <p className="text-xs text-slate-400">points this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Pill className="w-6 h-6 text-teal-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">{gamification.totalMedicinesTaken}</p>
          <p className="text-xs text-slate-400">Medicines Taken</p>
        </div>
        <div className="card p-4 text-center">
          <CalendarCheck className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">{gamification.totalTasksCompleted}</p>
          <p className="text-xs text-slate-400">Tasks Completed</p>
        </div>
        <div className="card p-4 text-center">
          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">{earnedBadges.length}</p>
          <p className="text-xs text-slate-400">Badges Earned</p>
        </div>
        <div className="card p-4 text-center">
          <TrendingUp className="w-6 h-6 text-success-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">{Math.round((dailyTasks.filter(t => t.completed).length / Math.max(dailyTasks.length, 1)) * 100)}%</p>
          <p className="text-xs text-slate-400">Today's Plan</p>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Earned Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map(badge => {
              const Icon = iconMap[badge.icon] || Award;
              return (
                <div key={badge.id} className="card p-5 text-center card-hover animate-scale-in">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-3 shadow-soft`}>
                    <Icon className="w-8 h-8 text-white" fill="white" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{badge.label}</h4>
                  <p className="text-xs text-slate-400 mt-1">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-600" />
          Badges to Unlock
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {lockedBadges.map(badge => {
            const Icon = iconMap[badge.icon] || Award;
            let progress = 0;
            if (badge.unit === 'points') progress = (gamification.points / badge.threshold) * 100;
            if (badge.unit === 'streak') progress = (gamification.streak / badge.threshold) * 100;
            if (badge.unit === 'medicines') progress = (gamification.totalMedicinesTaken / badge.threshold) * 100;
            if (badge.unit === 'tasks') progress = (gamification.totalTasksCompleted / badge.threshold) * 100;
            progress = Math.min(progress, 100);

            return (
              <div key={badge.id} className="card p-5 text-center opacity-75">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 relative">
                  <Icon className="w-8 h-8 text-slate-300" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
                <h4 className="font-bold text-slate-500 text-sm">{badge.label}</h4>
                <p className="text-xs text-slate-400 mt-1">{badge.description}</p>
                <div className="mt-3">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{Math.round(progress)}% complete</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to earn */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary-600" />
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Take medicine on schedule</p>
              <p className="text-xs text-slate-400">+10 points per medicine</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Complete daily plan tasks</p>
              <p className="text-xs text-slate-400">+5 points per task</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Daily mood check-in</p>
              <p className="text-xs text-slate-400">+5 points per check-in</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Maintain daily streak</p>
              <p className="text-xs text-slate-400">Be active every day</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="card p-5 bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center flex-shrink-0">
          <Target className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-slate-800">Ready to earn more points?</h3>
          <p className="text-sm text-slate-500">Complete your daily health plan tasks and take your medicines on time.</p>
        </div>
        <button onClick={() => navigate('daily-plan')} className="btn-primary text-sm whitespace-nowrap">
          View Daily Plan
        </button>
      </div>
    </div>
  );
}
