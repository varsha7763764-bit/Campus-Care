import { useState } from 'react';
import {
  HeartPulse,
  BookOpen,
  Brain,
  Moon,
  HeartHandshake,
  Check,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui';
import { demoMoods, wellbeingResources } from '@/data/demoData';

const iconMap: Record<string, typeof HeartPulse> = {
  BookOpen,
  Brain,
  Moon,
  HeartHandshake,
};

export function Wellbeing() {
  const { moods, addMood, navigate } = useApp();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMood = moods.find(m => m.date === todayStr);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    addMood({ date: todayStr, mood });
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Wellbeing" subtitle="Your mental health and wellness support hub" />

      {/* Mood Check-in */}
      <div className="card p-6 bg-gradient-to-br from-primary-50/50 to-secondary-50/50">
        <div className="flex items-center gap-2 mb-2">
          <HeartPulse className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-slate-800">Daily Mood Check-in</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">How are you feeling today? Track your mood to understand your wellbeing patterns.</p>

        {todayMood ? (
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
            <span className="text-4xl">{demoMoods.find(m => m.label === todayMood.mood)?.emoji}</span>
            <div>
              <p className="font-semibold text-slate-800">You're feeling {todayMood.mood.toLowerCase()} today</p>
              <p className="text-xs text-slate-400">Check in again tomorrow to track your mood over time.</p>
            </div>
            <div className="ml-auto">
              <Check className="w-6 h-6 text-success-500" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            {demoMoods.map(mood => (
              <button
                key={mood.label}
                onClick={() => handleMoodSelect(mood.label)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${selectedMood === mood.label ? mood.color + ' ring-2 ring-offset-2 ring-primary-300' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-sm font-medium text-slate-600">{mood.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mood History */}
      {moods.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" />
            Last 7 Days
          </h3>
          <div className="flex justify-between gap-2">
            {last7Days.map(date => {
              const entry = moods.find(m => m.date === date);
              const mood = entry ? demoMoods.find(m => m.label === entry.mood) : null;
              const d = new Date(date);
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${mood ? mood.color : 'bg-slate-50 text-slate-300'}`}>
                    {mood ? mood.emoji : '—'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {d.toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wellbeing Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {wellbeingResources.map(resource => {
          const Icon = iconMap[resource.icon] || HeartPulse;
          const isExpanded = expanded === resource.id;
          return (
            <div key={resource.id} className="card card-hover overflow-hidden">
              <div className={`bg-gradient-to-br ${resource.color} p-5 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{resource.title}</h3>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-3">{resource.description}</p>
              </div>
              <div className="p-5">
                <button
                  onClick={() => setExpanded(isExpanded ? null : resource.id)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {isExpanded ? 'Show less' : 'Learn more'}
                  <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="mt-4 space-y-3 animate-slide-up">
                    {resource.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Counselling CTA */}
      <div className="card p-6 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
            <HeartHandshake className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-slate-800">Need to talk to someone?</h3>
            <p className="text-sm text-slate-500 mt-1">
              The Counselling & Happiness Cell offers free, confidential support for all LPU students.
            </p>
          </div>
          <button onClick={() => navigate('emergency')} className="btn-primary text-sm whitespace-nowrap">
            Get Support
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-100 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          CampusCare Wellbeing is an educational and supportive tool. It does not provide medical diagnosis, mental health diagnosis, or treatment advice. If you are experiencing a mental health crisis, please contact the emergency helpline or campus counselling immediately.
        </p>
      </div>
    </div>
  );
}
