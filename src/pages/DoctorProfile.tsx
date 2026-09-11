import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Video,
  MapPin,
  Star,
  GraduationCap,
  Languages,
  Clock,
  Calendar,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { doctors } from '@/data/doctors';
import { useApp } from '@/context/AppContext';
import { DoctorAvatar, RatingStars, Badge } from '@/components/ui';
import type { ConsultationType } from '@/types';

export function DoctorProfile() {
  const { pageParams, navigate, addAppointment, addToCareTeam } = useApp();
  const doctor = useMemo(() => doctors.find(d => d.id === pageParams.doctorId), [pageParams.doctorId]);

  const [selectedDay, setSelectedDay] = useState(doctor?.slots[0]?.day || 'Mon');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultType, setConsultType] = useState<ConsultationType>('Online');
  const [confirmed, setConfirmed] = useState(false);

  if (!doctor) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Doctor not found.</p>
        <button onClick={() => navigate('find-doctor')} className="btn-primary mt-4">Back to Find Doctor</button>
      </div>
    );
  }

  const availableTimes = doctor.slots.find(s => s.day === selectedDay)?.times || [];
  const today = new Date();
  const dateStr = new Date(today.getTime() + 1 * 86400000).toISOString().split('T')[0];

  const handleConfirm = () => {
    if (!selectedTime) return;
    const appt = {
      id: `appt-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date: dateStr,
      time: selectedTime,
      type: consultType,
      status: 'upcoming' as const,
      createdAt: new Date().toISOString(),
    };
    addAppointment(appt);
    addToCareTeam({
      doctorId: doctor.id,
      lastConsultation: doctor.specialization,
      lastDate: dateStr,
    });
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Appointment Confirmed!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your {consultType} consultation with {doctor.name} has been scheduled for {dateStr} at {selectedTime}.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Doctor</span>
              <span className="font-medium text-slate-700">{doctor.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Specialization</span>
              <span className="font-medium text-slate-700">{doctor.specialization}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Date & Time</span>
              <span className="font-medium text-slate-700">{dateStr}, {selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Type</span>
              <span className="font-medium text-slate-700">{consultType} Consultation</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('appointments')} className="btn-primary flex-1">View Appointments</button>
            <button onClick={() => navigate('dashboard')} className="btn-secondary flex-1">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('find-doctor')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Doctors
      </button>

      {/* Doctor Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <DoctorAvatar initials={doctor.initials} color={doctor.avatarColor} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">{doctor.name}</h1>
            <p className="text-primary-600 font-medium mt-0.5">{doctor.specialization}</p>
            <div className="flex items-center gap-4 mt-2">
              <RatingStars rating={doctor.rating} reviews={doctor.reviews} />
              <span className="text-sm text-slate-400">{doctor.experience} years experience</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {doctor.consultationType.map(type => (
                <Badge key={type} color={type === 'Online' ? 'primary' : 'success'}>
                  {type === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">₹{doctor.fee}</p>
            <p className="text-xs text-slate-400">consultation fee</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-3">About</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{doctor.about}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary-600" />
                Education
              </h3>
              <p className="text-sm text-slate-600">{doctor.education}</p>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary-600" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map(lang => (
                  <Badge key={lang} color="neutral">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary-600" />
              Experience & Specialization
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{doctor.experience} years of practice</p>
                  <p className="text-xs text-slate-400">Specialized in {doctor.specialization}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{doctor.reviews}+ patient reviews</p>
                  <p className="text-xs text-slate-400">{doctor.rating} out of 5 average rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Panel */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              Book Appointment
            </h3>

            {/* Consultation Type */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-2 block">Consultation Type</label>
              <div className="grid grid-cols-2 gap-2">
                {doctor.consultationType.map(type => (
                  <button
                    key={type}
                    onClick={() => setConsultType(type)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                      consultType === type
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {type === 'Online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Selection */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-2 block">Select Day</label>
              <div className="grid grid-cols-5 gap-1.5">
                {doctor.slots.map(slot => (
                  <button
                    key={slot.day}
                    onClick={() => { setSelectedDay(slot.day); setSelectedTime(''); }}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedDay === slot.day
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {slot.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-2 block">Available Time Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      selectedTime === time
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedTime}
              className="btn-primary w-full"
            >
              Confirm Appointment
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Appointment date: {dateStr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
