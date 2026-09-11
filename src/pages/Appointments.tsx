import { useState, useMemo } from 'react';
import {
  CalendarDays,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CalendarPlus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { doctors } from '@/data/doctors';
import { PageHeader, DoctorAvatar, Badge, EmptyState } from '@/components/ui';
import type { AppointmentStatus } from '@/types';

export function Appointments() {
  const { appointments, navigate, updateAppointment } = useApp();
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return appointments;
    return appointments.filter(a => a.status === filter);
  }, [appointments, filter]);

  const tabs: { key: AppointmentStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" subtitle="Manage your consultations and appointments">
        <button onClick={() => navigate('find-doctor')} className="btn-primary text-sm">
          <CalendarPlus className="w-4 h-4" />
          New Appointment
        </button>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-primary-600 text-white shadow-soft'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({appointments.filter(a => a.status === tab.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No appointments yet"
          description="Book your first consultation with one of our experienced doctors."
          action={
            <button onClick={() => navigate('find-doctor')} className="btn-primary">
              Find a Doctor
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(appt => {
            const doctor = doctors.find(d => d.id === appt.doctorId);
            if (!doctor) return null;
            return (
              <div key={appt.id} className="card p-4 hover:shadow-soft transition-all">
                <div className="flex items-center gap-4">
                  <DoctorAvatar initials={doctor.initials} color={doctor.avatarColor} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{doctor.name}</h3>
                    <p className="text-sm text-slate-500">{appt.specialization}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {appt.date}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appt.time}
                      </span>
                      <Badge color={appt.type === 'Online' ? 'primary' : 'success'}>
                        {appt.type === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {appt.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {appt.status === 'upcoming' && (
                      <Badge color="warning">Upcoming</Badge>
                    )}
                    {appt.status === 'completed' && (
                      <Badge color="success">Completed</Badge>
                    )}
                    {appt.status === 'cancelled' && (
                      <Badge color="danger">Cancelled</Badge>
                    )}
                    {appt.status === 'upcoming' && (
                      <div className="flex gap-2">
                        {appt.type === 'Online' && (
                          <button
                            onClick={() => navigate('consultation', { appointmentId: appt.id })}
                            className="btn-primary text-xs px-3 py-1.5"
                          >
                            Join
                          </button>
                        )}
                        <button
                          onClick={() => updateAppointment(appt.id, { status: 'cancelled' })}
                          className="btn-ghost text-xs px-3 py-1.5"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {appt.status === 'completed' && (
                      <button
                        onClick={() => navigate('prescription', { appointmentId: appt.id })}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        View Prescription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
