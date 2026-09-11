import { useState, useMemo } from 'react';
import {
  FileText,
  Pill,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Stethoscope,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { doctors } from '@/data/doctors';
import { DoctorAvatar, Badge } from '@/components/ui';
import type { Prescription as RxType } from '@/types';

export function Prescription() {
  const { pageParams, navigate, appointments, prescriptions, addPrescription, addToRoutine } = useApp();
  const appt = appointments.find(a => a.id === pageParams.appointmentId);
  const doctor = appt ? doctors.find(d => d.id === appt.doctorId) : null;
  const existingRx = useMemo(() => prescriptions.find(p => p.appointmentId === pageParams.appointmentId), [prescriptions, pageParams.appointmentId]);

  const [addedMeds, setAddedMeds] = useState<Set<string>>(new Set());

  // Generate a demo prescription if one doesn't exist
  const rx: RxType | null = useMemo(() => {
    if (existingRx) return existingRx;
    if (!appt || !doctor) return null;
    const newRx: RxType = {
      id: `rx-${Date.now()}`,
      appointmentId: appt.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date: new Date().toISOString().split('T')[0],
      patientName: 'Demo Student',
      medicines: generateDemoPrescription(doctor.specialization),
      instructions: 'Complete the full course of prescribed medicines. Stay hydrated and get adequate rest. If symptoms persist or worsen, schedule a follow-up consultation.',
    };
    addPrescription(newRx);
    return newRx;
  }, [existingRx, appt, doctor]);

  if (!rx || !doctor) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Prescription not found.</p>
        <button onClick={() => navigate('appointments')} className="btn-primary mt-4">Back to Appointments</button>
      </div>
    );
  }

  const handleAddToRoutine = (med: typeof rx.medicines[0], index: number) => {
    const slot = inferSlot(med.frequency);
    addToRoutine({
      name: med.name,
      dosage: med.dosage,
      time: inferTime(slot),
      slot,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      duration: med.duration,
      prescriptionId: rx.id,
    });
    setAddedMeds(prev => new Set(prev).add(`${index}`));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('appointments')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </button>

      {/* Prescription Header */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Digital Prescription</h2>
                <p className="text-white/70 text-sm">CampusCare e-Prescription</p>
              </div>
            </div>
            <Badge color="success">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </Badge>
          </div>
        </div>

        {/* Doctor + Patient Info */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <DoctorAvatar initials={doctor.initials} color={doctor.avatarColor} />
            <div>
              <p className="text-xs text-slate-400 font-medium">Prescribed by</p>
              <p className="font-semibold text-slate-800">{rx.doctorName}</p>
              <p className="text-sm text-primary-600">{rx.specialization}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Patient:</span>
              <span className="font-medium text-slate-700">{rx.patientName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Date:</span>
              <span className="font-medium text-slate-700">{rx.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Stethoscope className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Rx ID:</span>
              <span className="font-medium text-slate-700">{rx.id}</span>
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary-600" />
            Prescribed Medicines
          </h3>
          <div className="space-y-3">
            {rx.medicines.map((med, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <h4 className="font-semibold text-slate-800">{med.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ml-9">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Dosage</p>
                        <p className="text-sm text-slate-700">{med.dosage}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Frequency</p>
                        <p className="text-sm text-slate-700">{med.frequency}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Duration</p>
                        <p className="text-sm text-slate-700">{med.duration}</p>
                      </div>
                    </div>
                    <div className="ml-9 mt-2">
                      <p className="text-[11px] text-slate-400 font-medium">Instructions</p>
                      <p className="text-xs text-slate-600 mt-0.5">{med.instructions}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToRoutine(med, i)}
                    disabled={addedMeds.has(`${i}`)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      addedMeds.has(`${i}`)
                        ? 'bg-success-100 text-success-700 cursor-default'
                        : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
                    }`}
                  >
                    {addedMeds.has(`${i}`) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Add to Routine
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* General Instructions */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">General Instructions</p>
                <p className="text-sm text-amber-700 mt-1">{rx.instructions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              This is a demo prescription for educational purposes. Not for actual medical use.
            </p>
            <button
              onClick={() => {
                rx.medicines.forEach((med, i) => {
                  if (!addedMeds.has(`${i}`)) handleAddToRoutine(med, i);
                });
              }}
              className="btn-primary text-sm"
            >
              Add All to Routine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateDemoPrescription(specialization: string) {
  const presets: Record<string, Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>> = {
    'General Physician': [
      { name: 'Paracetamol', dosage: '650 mg', frequency: 'After meals, 3x daily', duration: '5 days', instructions: 'Take with water. Do not exceed 4 tablets in 24 hours.' },
      { name: 'Vitamin C', dosage: '500 mg', frequency: 'Once daily, morning', duration: '15 days', instructions: 'Take on an empty stomach for better absorption.' },
    ],
    'Dermatology': [
      { name: 'Hydrocortisone Cream', dosage: '1% topical', frequency: 'Apply twice daily', duration: '3 weeks', instructions: 'Apply a thin layer on affected area. Avoid contact with eyes.' },
      { name: 'Cetirizine 10 mg', dosage: '10 mg', frequency: 'Once at night', duration: '2 weeks', instructions: 'May cause drowsiness. Take before bedtime.' },
    ],
    'Dental': [
      { name: 'Amoxicillin', dosage: '500 mg', frequency: '3x daily', duration: '7 days', instructions: 'Complete full course even if pain subsides. Take after meals.' },
      { name: 'Ibuprofen', dosage: '400 mg', frequency: 'Every 8 hours as needed', duration: '5 days', instructions: 'Take with food. Stop if stomach discomfort occurs.' },
    ],
    'Eye Care': [
      { name: 'Lubricant Eye Drops', dosage: '1 drop per eye', frequency: '4x daily', duration: '2 weeks', instructions: 'Do not touch the dropper tip. Wait 5 minutes between drops.' },
      { name: 'Vitamin A', dosage: '10000 IU', frequency: 'Once daily', duration: '30 days', instructions: 'Take with a meal containing fat for better absorption.' },
    ],
    'Mental Wellness': [
      { name: 'Melatonin', dosage: '3 mg', frequency: '30 min before bedtime', duration: '2 weeks', instructions: 'Helps regulate sleep cycle. Take only at night.' },
      { name: 'Vitamin B Complex', dosage: '1 tablet', frequency: 'Once daily, morning', duration: '30 days', instructions: 'Supports nervous system health. Take with breakfast.' },
    ],
    'Gynecology': [
      { name: 'Folic Acid', dosage: '5 mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with water. Best taken in the morning.' },
      { name: 'Iron Supplement', dosage: '1 tablet', frequency: 'After lunch', duration: '30 days', instructions: 'Take with citrus juice for better absorption. May cause dark stools.' },
    ],
  };
  return presets[specialization] || presets['General Physician'];
}

function inferSlot(frequency: string): 'Morning' | 'Afternoon' | 'Evening' | 'Night' {
  const f = frequency.toLowerCase();
  if (f.includes('night') || f.includes('bedtime')) return 'Night';
  if (f.includes('morning') || f.includes('breakfast')) return 'Morning';
  if (f.includes('lunch') || f.includes('afternoon')) return 'Afternoon';
  return 'Evening';
}

function inferTime(slot: string): string {
  const times: Record<string, string> = {
    Morning: '08:00 AM',
    Afternoon: '02:00 PM',
    Evening: '06:00 PM',
    Night: '09:00 PM',
  };
  return times[slot] || '08:00 AM';
}
