import {
  Users,
  ArrowRight,
  Video,
  MapPin,
  Clock,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { doctors } from '@/data/doctors';
import { PageHeader, DoctorAvatar, RatingStars, Badge, EmptyState } from '@/components/ui';

export function CareTeam() {
  const { careTeam, navigate } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader title="My Care Team" subtitle="Doctors you've previously consulted at LPU" />

      {careTeam.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No consultations yet"
          description="Once you book and complete appointments, your doctors will appear here for easy follow-ups."
          action={
            <button onClick={() => navigate('find-doctor')} className="btn-primary">
              Find a Doctor
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careTeam.map(member => {
            const doctor = doctors.find(d => d.id === member.doctorId);
            if (!doctor) return null;
            return (
              <div key={member.doctorId} className="card card-hover p-5">
                <div className="flex items-start gap-4">
                  <DoctorAvatar initials={doctor.initials} color={doctor.avatarColor} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800">{doctor.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{doctor.specialization}</p>
                    <div className="mt-1.5">
                      <RatingStars rating={doctor.rating} reviews={doctor.reviews} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Last consultation:</span>
                    <span className="font-medium text-slate-700">{member.lastDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Reason:</span>
                    <span className="font-medium text-slate-700">{member.lastConsultation}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {doctor.consultationType.map(type => (
                    <Badge key={type} color={type === 'Online' ? 'primary' : 'success'}>
                      {type === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {type}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => navigate('doctor-profile', { doctorId: doctor.id })}
                    className="btn-secondary text-sm flex-1"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate('doctor-profile', { doctorId: doctor.id, action: 'book' })}
                    className="btn-primary text-sm flex-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Consult Again
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
