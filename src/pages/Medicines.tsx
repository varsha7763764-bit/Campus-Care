import { useState, useRef } from 'react';
import {
  Package,
  Pill,
  FileText,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  X,
  Sparkles,
  Camera,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge, SectionCard } from '@/components/ui';
import { medicineCatalog, demoPrescriptions } from '@/data/demoData';

type Tab = 'current' | 'prescriptions' | 'routine' | 'find' | 'assistant';

export function Medicines() {
  const { routine, prescriptions, navigate } = useApp();
  const [tab, setTab] = useState<Tab>('current');
  const [search, setSearch] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ identified: boolean; medicine?: string; category?: string; use?: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: 'current', label: 'Current Medicines', icon: Pill },
    { key: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { key: 'routine', label: 'Medicine Routine', icon: Calendar },
    { key: 'find', label: 'Find Medicine', icon: Search },
    { key: 'assistant', label: 'Medicine Assistant', icon: Sparkles },
  ];

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      setUploadedImage(e.target?.result as string);
      setResult(null);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        // Simulate identification - 50% chance of identifying
        const identified = Math.random() > 0.5;
        if (identified) {
          const med = medicineCatalog[Math.floor(Math.random() * medicineCatalog.length)];
          setResult({ identified: true, medicine: med.name, category: med.category, use: med.use });
        } else {
          setResult({ identified: false });
        }
      }, 2500);
    };
    reader.readAsDataURL(file);
  };

  const filteredMedicines = medicineCatalog.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Medicines" subtitle="Manage your medicines, prescriptions, and medicine routine" />

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Current Medicines */}
      {tab === 'current' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routine.map(med => (
            <div key={med.id} className="card card-hover p-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm">{med.name}</h3>
                  <p className="text-xs text-slate-400">{med.dosage}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge color="primary">{med.slot}</Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {med.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50">
                <p className="text-xs text-slate-400">
                  Duration: <span className="font-medium text-slate-600">{med.duration}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Days: <span className="font-medium text-slate-600">{med.days.join(', ')}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescriptions */}
      {tab === 'prescriptions' && (
        <div className="space-y-4">
          {prescriptions.map(rx => (
            <div key={rx.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{rx.doctorName}</h3>
                    <p className="text-xs text-slate-400">{rx.specialization} • {rx.date}</p>
                  </div>
                </div>
                <Badge color="neutral">Rx: {rx.id}</Badge>
              </div>
              <div className="space-y-2">
                {rx.medicines.map((med, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Pill className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{med.name} — {med.dosage}</p>
                      <p className="text-xs text-slate-400">{med.frequency} • {med.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50">
                <p className="text-xs text-slate-400">{rx.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medicine Routine */}
      {tab === 'routine' && (
        <SectionCard title="Your Medicine Routine">
          <p className="text-sm text-slate-500 mb-4">Quick overview of your current medicine schedule.</p>
          <div className="space-y-2">
            {routine.map(med => (
              <div key={med.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Pill className="w-4 h-4 text-primary-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{med.name} ({med.dosage})</p>
                  <p className="text-xs text-slate-400">{med.slot} • {med.time} • {med.duration}</p>
                </div>
                <Badge color="neutral">{med.days.length} days</Badge>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('medical-routine')} className="btn-secondary text-sm mt-4">
            View Full Routine
          </button>
        </SectionCard>
      )}

      {/* Find Medicine */}
      {tab === 'find' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines by name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map(med => (
              <div key={med.name} className="card card-hover p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm">{med.name}</h3>
                    <Badge color="neutral">{med.category}</Badge>
                    <p className="text-xs text-slate-400 mt-2">{med.use}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medicine Assistant */}
      {tab === 'assistant' && (
        <div className="max-w-2xl mx-auto">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-primary-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Medicine Assistant</h3>
                <p className="text-sm text-slate-400">Upload a medicine image to identify it</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                This is a demo assistant and cannot actually identify medicines. Always verify medicine information with a healthcare professional or the packaging label.
              </p>
            </div>

            {!uploadedImage ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="mt-4 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
                <p className="font-medium text-slate-700">Upload a medicine image</p>
                <p className="text-sm text-slate-400 mt-1">Click to select or drag and drop</p>
                <p className="text-xs text-slate-300 mt-2">JPG, PNG up to 5MB</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <img src={uploadedImage} alt="Medicine" className="w-full max-h-64 object-contain rounded-2xl bg-slate-50" />
                  <button
                    onClick={() => { setUploadedImage(null); setResult(null); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-soft flex items-center justify-center hover:bg-white"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {analyzing && (
                  <div className="flex flex-col items-center py-6">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin mb-3" />
                    <p className="text-sm text-slate-500">Analyzing image...</p>
                  </div>
                )}

                {result && !analyzing && (
                  <div className={`rounded-2xl p-4 ${result.identified ? 'bg-success-50 border border-success-200' : 'bg-amber-50 border border-amber-200'}`}>
                    {result.identified ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-success-600" />
                          <h4 className="font-semibold text-success-800">Medicine Identified</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Name</span>
                            <span className="font-medium text-slate-700">{result.medicine}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Category</span>
                            <span className="font-medium text-slate-700">{result.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Common Use</span>
                            <span className="font-medium text-slate-700">{result.use}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                          This is a demo identification. Always verify with the packaging label or consult a healthcare professional.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                          <h4 className="font-semibold text-amber-800">Unable to Identify</h4>
                        </div>
                        <p className="text-sm text-amber-700">
                          We couldn't confidently identify this medicine. Please check the medicine packaging label or consult a healthcare professional before taking any medication.
                        </p>
                        <button
                          onClick={() => { setUploadedImage(null); setResult(null); }}
                          className="btn-secondary text-sm mt-3"
                        >
                          Try Another Image
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!analyzing && !result && (
                  <button onClick={() => fileRef.current?.click()} className="btn-secondary text-sm w-full">
                    <Camera className="w-4 h-4" />
                    Upload Another
                  </button>
                )}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
