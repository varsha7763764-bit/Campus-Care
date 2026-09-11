import {
  Siren,
  Shield,
  Building2,
  Hospital,
  HeartHandshake,
  Phone,
  AlertTriangle,
  MapPin,
  Clock,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { emergencyContacts } from '@/data/demoData';

const iconMap: Record<string, typeof Siren> = {
  Siren,
  Shield,
  Building2,
  Hospital,
  HeartHandshake,
};

export function Emergency() {
  return (
    <div className="space-y-6">
      <PageHeader title="Emergency" subtitle="Quick access to campus and emergency healthcare contacts" />

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-danger-500 to-red-600 rounded-2xl p-5 text-white shadow-soft">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 animate-pulse-soft" />
          <div>
            <h3 className="font-bold text-lg">Real Emergency? Call 108 Immediately</h3>
            <p className="text-white/90 text-sm mt-1">
              If you or someone else is in a life-threatening situation, contact official emergency services directly.
              This app is a demo and should not be relied upon during a real medical emergency.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencyContacts.map(contact => {
          const Icon = iconMap[contact.icon] || Siren;
          return (
            <div key={contact.id} className="card card-hover p-5">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800">{contact.title}</h3>
                  {contact.demo && (
                    <span className="inline-block text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
                      Demo Contact
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3">{contact.description}</p>
              <a
                href={`tel:${contact.number}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm transition-all hover:bg-primary-700 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                {contact.number}
              </a>
            </div>
          );
        })}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-600" />
            Campus Health Centre Hours
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Monday – Friday</span>
              <span className="text-sm font-medium text-slate-700">8:00 AM – 10:00 PM</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Saturday</span>
              <span className="text-sm font-medium text-slate-700">9:00 AM – 6:00 PM</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Sunday & Holidays</span>
              <span className="text-sm font-medium text-slate-700">10:00 AM – 4:00 PM</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-danger-50 rounded-xl">
              <span className="text-sm text-danger-700 font-medium">Emergency</span>
              <span className="text-sm font-bold text-danger-700">24/7 Available</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" />
            Nearest Medical Facilities
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-700">Uni-Health Centre</p>
              <p className="text-xs text-slate-400">Block 1, LPU Campus — 0 km (on campus)</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-700">Apollo Hospitals</p>
              <p className="text-xs text-slate-400">Phagwara — ~3 km from campus</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-700">Counselling & Happiness Cell</p>
              <p className="text-xs text-slate-400">Block 27, LPU Campus — 0 km (on campus)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Demo Information Notice</p>
          <p className="text-xs text-amber-700 mt-1">
            Contact numbers marked as "Demo Contact" are fictional and for demonstration purposes only.
            In a real emergency, always call official emergency services (108 in India) directly.
          </p>
        </div>
      </div>
    </div>
  );
}
