import { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Volume2,
  MessageSquare,
  ScreenShare,
  Clock,
  User,
  Signal,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { doctors } from '@/data/doctors';
import { DoctorAvatar } from '@/components/ui';

export function Consultation() {
  const { pageParams, navigate, updateAppointment } = useApp();
  const appt = useApp().appointments.find(a => a.id === pageParams.appointmentId);
  const doctor = appt ? doctors.find(d => d.id === appt.doctorId) : null;

  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [ended, setEnded] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  if (!appt || !doctor) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Consultation not found.</p>
        <button onClick={() => navigate('appointments')} className="btn-primary mt-4">Back to Appointments</button>
      </div>
    );
  }

  if (ended) {
    // Auto-navigate to prescription after showing end screen briefly
    return (
      <div className="max-w-md mx-auto">
        <div className="card p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
            <PhoneOff className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Consultation Ended</h2>
          <p className="text-sm text-slate-500 mb-2">
            Your consultation with {doctor.name} lasted {formatTime(seconds)}.
          </p>
          <p className="text-sm text-slate-400 mb-6">
            Your digital prescription is being prepared...
          </p>
          <button
            onClick={() => {
              updateAppointment(appt.id, { status: 'completed' });
              navigate('prescription', { appointmentId: appt.id });
            }}
            className="btn-primary w-full"
          >
            View Digital Prescription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('appointments')} className="text-sm text-slate-500 hover:text-slate-800">
          ← Back to Appointments
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Signal className="w-4 h-4 text-success-500" />
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      {/* Video Call Area */}
      <div className="video-gradient rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[400px] sm:min-h-[500px] flex flex-col">
        {/* Animated background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        {/* Doctor Video (main) */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 animate-pulse-soft">
              <DoctorAvatar initials={doctor.initials} color={doctor.avatarColor} size="lg" />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-success-500 border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{doctor.name}</h2>
          <p className="text-white/70 text-sm">{doctor.specialization}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium flex items-center gap-1.5">
              <Video className="w-3 h-3" />
              Online Consultation
            </span>
          </div>
        </div>

        {/* Self Video (picture-in-picture) */}
        <div className="absolute bottom-24 right-4 sm:right-8 w-28 h-36 sm:w-36 sm:h-44 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
          {videoOn ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-700/50 to-slate-900/50 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-500/30 flex items-center justify-center">
                <User className="w-6 h-6 text-white/80" />
              </div>
            </div>
          ) : (
            <VideoOff className="w-6 h-6 text-white/40" />
          )}
          <span className="absolute bottom-1.5 left-2 text-[10px] text-white/60 font-medium">You</span>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              micOn ? 'bg-white/15 text-white' : 'bg-white text-slate-800'
            }`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              videoOn ? 'bg-white/15 text-white' : 'bg-white text-slate-800'
            }`}
          >
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:scale-110 transition-all">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:scale-110 transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:scale-110 transition-all">
            <ScreenShare className="w-5 h-5" />
          </button>
          <button
            onClick={() => setEnded(true)}
            className="w-14 h-14 rounded-full bg-danger-600 text-white flex items-center justify-center hover:bg-danger-700 hover:scale-110 transition-all shadow-lg"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Consultation in progress</p>
            <p className="text-xs text-slate-400">Scheduled: {appt.date} at {appt.time}</p>
          </div>
        </div>
        <button onClick={() => setEnded(true)} className="btn-danger text-sm">
          End Consultation
        </button>
      </div>
    </div>
  );
}
