import {
  Stethoscope,
  CalendarPlus,
  Pill,
  Siren,
  Clock,
  CheckCircle2,
  Circle,
  Sun,
  Moon,
  Heart,
  Activity,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp, DAYS } from '@/context/AppContext';
import { doctors } from '@/data/doctors';
import { ProgressRing, DoctorAvatar, Badge } from '@/components/ui';
import { demoMoods } from '@/data/demoData';

export function Dashboard() {
  const { navigate, appointments, routine, currentDay, moods, addMood } = useApp();

  const todayMeds = routine.filter(m => m.days.includes(DAYS[currentDay]));
  const takenToday = todayMeds.filter(m => m.taken[currentDay]).length;
  const todayProgress = todayMeds.length > 0 ? (takenToday / todayMeds.length) * 100 : 0;

  const upcomingAppt = appointments.find(a => a.status === 'upcoming');
  const upcomingDoctor = upcomingAppt ? doctors.find(d => d.id === upcomingAppt.doctorId) : null;

  const nextMed = todayMeds.find(m => !m.taken[currentDay]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMood = moods.find(m => m.date === todayStr);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const quickActions = [
    { label: 'Find Doctor', icon: Stethoscope, color: 'from-blue-500 to-blue-600', action: () => navigate('find-doctor') },
    { label: 'Book Appointment', icon: CalendarPlus, color: 'from-indigo-500 to-indigo-600', action: () => navigate('find-doctor') },
    { label: 'Medical Routine', icon: Pill, color: 'from-teal-500 to-cyan-600', action: () => navigate('medical-routine') },
    { label: 'Emergency', icon: Siren, color: 'from-red-500 to-red-600', action: () => navigate('emergency') },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-glow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-white/80" fill="white" />
            <span className="text-sm font-medium text-white/80">CampusCare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{greeting}, Student!</h1>
          <p className="text-white/80 text-sm max-w-md">
            Here's your health overview for today. Stay healthy, stay focused.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
              <span className="text-xs text-white/70">Appointments</span>
              <p className="text-lg font-bold">{appointments.filter(a => a.status === 'upcoming').length} upcoming</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
              <span className="text-xs text-white/70">Medicines Today</span>
              <p className="text-lg font-bold">{takenToday}/{todayMeds.length} taken</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
              <span className="text-xs text-white/70">Care Team</span>
              <p className="text-lg font-bold">{doctors.filter(d => d.rating >= 4.7).length} doctors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.action}
              className="card card-hover p-4 text-left group"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-soft`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{action.label}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 group-hover:text-primary-600 transition-colors">
                <span>Open</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointment */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-primary-600" />
              Today's Appointment
            </h3>
            <button onClick={() => navigate('appointments')} className="text-xs font-medium text-primary-600 hover:text-primary-700">
              View all
            </button>
          </div>
          {upcomingAppt && upcomingDoctor ? (
            <div className="flex items-center gap-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
              <DoctorAvatar initials={upcomingDoctor.initials} color={upcomingDoctor.avatarColor} size="lg" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800">{upcomingDoctor.name}</h4>
                <p className="text-sm text-slate-500">{upcomingDoctor.specialization}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge color={upcomingAppt.type === 'Online' ? 'primary' : 'success'}>
                    {upcomingAppt.type}
                  </Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {upcomingAppt.date} at {upcomingAppt.time}
                  </span>
                </div>
              </div>
              {upcomingAppt.type === 'Online' && (
                <button
                  onClick={() => navigate('consultation', { appointmentId: upcomingAppt.id })}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Join
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                <CalendarPlus className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-400 mb-3">No appointments scheduled for today</p>
              <button onClick={() => navigate('find-doctor')} className="btn-secondary text-sm">
                Book an Appointment
              </button>
            </div>
          )}
        </div>

        {/* Medical Routine Progress */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Pill className="w-4 h-4 text-primary-600" />
            Routine Progress
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing progress={todayProgress} size={130} />
            <p className="text-sm text-slate-500 mt-3 text-center">
              {takenToday} of {todayMeds.length} medicines completed today
            </p>
            <button
              onClick={() => navigate('medical-routine')}
              className="btn-secondary text-sm mt-3 w-full"
            >
              View Full Routine
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Medicine */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary-600" />
            Upcoming Medicine
          </h3>
          {nextMed ? (
            <div className="space-y-2">
              {todayMeds.filter(m => !m.taken[currentDay]).slice(0, 3).map(med => (
                <div key={med.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${med.slot === 'Morning' ? 'bg-amber-100' : med.slot === 'Night' ? 'bg-indigo-100' : 'bg-teal-100'}`}>
                    {med.slot === 'Morning' ? <Sun className="w-5 h-5 text-amber-600" /> : med.slot === 'Night' ? <Moon className="w-5 h-5 text-indigo-600" /> : <Clock className="w-5 h-5 text-teal-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{med.name}</p>
                    <p className="text-xs text-slate-400">{med.dosage} • {med.time}</p>
                  </div>
                  <Badge color="warning">{med.slot}</Badge>
                </div>
              ))}
            </div>
          ) : todayMeds.length > 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-success-500 mb-2" />
              <p className="text-sm text-slate-600 font-medium">All medicines taken today!</p>
              <p className="text-xs text-slate-400 mt-1">Great job staying on track.</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No medicines scheduled for today.</p>
          )}
        </div>

        {/* Wellbeing Check-in */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-rose-500" />
            Wellbeing Check-in
          </h3>
          <p className="text-xs text-slate-400 mb-4">How are you feeling today?</p>
          {todayMood ? (
            <div className="flex flex-col items-center py-4">
              <span className="text-4xl mb-2">{demoMoods.find(m => m.label === todayMood.mood)?.emoji}</span>
              <p className="text-sm font-medium text-slate-600">You're feeling {todayMood.mood.toLowerCase()} today</p>
              <button onClick={() => navigate('wellbeing')} className="btn-ghost text-sm mt-3">
                View Wellbeing Resources
              </button>
            </div>
          ) : (
            <div className="flex justify-between gap-2">
              {demoMoods.map(mood => (
                <button
                  key={mood.label}
                  onClick={() => addMood({ date: todayStr, mood: mood.label })}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all hover:scale-105 ${mood.color} hover:shadow-soft`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-[10px] font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary-600" />
          Weekly Medicine Overview
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, i) => {
            const dayMeds = routine.filter(m => m.days.includes(day));
            const dayTaken = dayMeds.filter(m => m.taken[i]).length;
            const dayProgress = dayMeds.length > 0 ? (dayTaken / dayMeds.length) * 100 : 0;
            const isToday = i === currentDay;
            return (
              <div key={day} className={`flex flex-col items-center gap-2 p-3 rounded-xl ${isToday ? 'bg-primary-50 border-2 border-primary-200' : 'bg-slate-50'}`}>
                <span className={`text-xs font-semibold ${isToday ? 'text-primary-700' : 'text-slate-500'}`}>{day}</span>
                <div className="relative w-12 h-12">
                  <svg width="48" height="48" className="-rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                    <circle
                      cx="24" cy="24" r="20"
                      fill="none"
                      stroke={isToday ? '#2563eb' : '#64748b'}
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 20}
                      strokeDashoffset={2 * Math.PI * 20 - (dayProgress / 100) * 2 * Math.PI * 20}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-600">{dayTaken}/{dayMeds.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
