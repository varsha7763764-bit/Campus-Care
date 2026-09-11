import { useEffect, useRef } from 'react';
import {
  MapPin,
  Building2,
  Hospital,
  Pill,
  HeartHandshake,
  Navigation,
  Home,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { lpuLocations } from '@/data/demoData';

const iconMap: Record<string, typeof Building2> = {
  Building2,
  Hospital,
  Pill,
  HeartHandshake,
};

export function LPUHealthcare() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!mapRef.current || mapInstance.current) return;

      const L = (await import('leaflet')).default;

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [31.2539, 75.7050],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      lpuLocations.forEach(loc => {
        const iconHtml = `<div style="background:${loc.color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px;">${getIconEmoji(loc.icon)}</span></div>`;
        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;"><strong>${loc.name}</strong><br/><span style="color:#64748b;font-size:12px;">${loc.type}</span><br/><span style="color:#475569;font-size:11px;">${loc.description}</span></div>`);
      });
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="LPU Healthcare" subtitle="Healthcare facilities in and around the LPU campus" />

      {/* Hostel Student Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-700 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <Home className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">Built for Hostel Students</h3>
            <p className="text-white/80 text-sm mt-1">
              Living on campus? CampusCare helps you find the nearest healthcare facilities quickly — from the Uni-Health Centre to the campus medical store and counselling cell. No need to wander around when you need care.
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-600" />
          Interactive Campus Map
        </h3>
        <div ref={mapRef} className="w-full h-[400px] rounded-2xl overflow-hidden z-0" />
        <p className="text-xs text-slate-400 mt-2 text-center">
          Map shows approximate locations of healthcare facilities near LPU campus. Distances may vary.
        </p>
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lpuLocations.map(loc => {
          const Icon = iconMap[loc.icon] || Building2;
          return (
            <div key={loc.id} className="card card-hover p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: loc.color + '15' }}>
                  <Icon className="w-6 h-6" style={{ color: loc.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{loc.name}</h3>
                  <span className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mt-1">
                    {loc.type}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3">{loc.description}</p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=17/${loc.lat}/${loc.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm transition-all hover:bg-slate-200 active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-slate-100 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Map locations are approximate and for demonstration purposes. Always verify the exact location of healthcare facilities before visiting. In an emergency, call 108.
        </p>
      </div>
    </div>
  );
}

function getIconEmoji(icon: string): string {
  const emojis: Record<string, string> = {
    Building2: '🏥',
    Hospital: '🏨',
    Pill: '💊',
    HeartHandshake: '💚',
  };
  return emojis[icon] || '📍';
}
