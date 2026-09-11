import { useState, useMemo } from 'react';
import { Search, Stethoscope, Video, MapPin, ArrowRight, Filter } from 'lucide-react';
import { doctors, specializations } from '@/data/doctors';
import { useApp } from '@/context/AppContext';
import { PageHeader, DoctorAvatar, RatingStars, Badge } from '@/components/ui';

export function FindDoctor() {
  const { navigate } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || d.specialization === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Find a Doctor" subtitle="Connect with experienced healthcare professionals on campus" />

      {/* Search + Filters */}
      <div className="card p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <button
            onClick={() => setFilter('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === 'All' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Specializations
          </button>
          {specializations.map(spec => (
            <button
              key={spec}
              onClick={() => setFilter(spec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === spec ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(doctor => (
          <div key={doctor.id} className="card card-hover p-5 group">
            <div className="flex items-start gap-4">
              <DoctorAvatar initials={doctor.initials} color={doctor.avatarColor} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-lg">{doctor.name}</h3>
                <p className="text-sm text-primary-600 font-medium">{doctor.specialization}</p>
                <div className="mt-1.5">
                  <RatingStars rating={doctor.rating} reviews={doctor.reviews} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{doctor.experience} years experience</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {doctor.consultationType.map(type => (
                <Badge key={type} color={type === 'Online' ? 'primary' : 'success'}>
                  {type === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  {type} Consultation
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Next available: {doctor.slots[0]?.day}, {doctor.slots[0]?.times[0]}</span>
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
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No doctors found matching your search.</p>
        </div>
      )}
    </div>
  );
}
