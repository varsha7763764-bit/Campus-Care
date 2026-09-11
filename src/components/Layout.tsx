import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  Pill,
  Users,
  Package,
  HeartPulse,
  Siren,
  MapPin,
  Menu,
  X,
  Heart,
  Activity,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageKey } from '@/types';

const navItems: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'find-doctor', label: 'Find Doctor', icon: Stethoscope },
  { key: 'appointments', label: 'Appointments', icon: CalendarDays },
  { key: 'medical-routine', label: 'Medical Routine', icon: Pill },
  { key: 'care-team', label: 'My Care Team', icon: Users },
  { key: 'medicines', label: 'Medicines', icon: Package },
  { key: 'wellbeing', label: 'Wellbeing', icon: HeartPulse },
  { key: 'emergency', label: 'Emergency', icon: Siren },
  { key: 'lpu-healthcare', label: 'LPU Healthcare', icon: MapPin },
];

export function Layout({ children }: { children: ReactNode }) {
  const { currentPage, navigate } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (key: PageKey) => {
    navigate(key);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 fixed h-screen z-30">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">CampusCare</h1>
            <p className="text-[11px] text-slate-400 font-medium">LPU Student Health</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.key ||
              (item.key === 'find-doctor' && currentPage === 'doctor-profile') ||
              (item.key === 'appointments' && currentPage === 'consultation') ||
              (item.key === 'appointments' && currentPage === 'prescription');
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`nav-item w-full text-left ${active ? 'nav-item-active' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
                {item.key === 'emergency' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-danger-500 animate-pulse-soft" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-semibold text-primary-700">Health Tip</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Stay hydrated! Drink at least 8 glasses of water daily for better focus and energy.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 glass border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <h1 className="text-base font-bold text-slate-800">CampusCare</h1>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full flex flex-col animate-slide-in shadow-2xl">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">CampusCare</h1>
                  <p className="text-[11px] text-slate-400 font-medium">LPU Student Health</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = currentPage === item.key ||
                  (item.key === 'find-doctor' && currentPage === 'doctor-profile') ||
                  (item.key === 'appointments' && (currentPage === 'consultation' || currentPage === 'prescription'));
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.key)}
                    className={`nav-item w-full text-left ${active ? 'nav-item-active' : ''}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                    {item.key === 'emergency' && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-danger-500 animate-pulse-soft" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
