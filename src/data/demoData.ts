export const demoMedicines = [
  {
    name: 'Vitamin D3',
    dosage: '60,000 IU',
    time: '09:00 AM',
    slot: 'Morning' as const,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    duration: '8 weeks',
  },
  {
    name: 'Cetirizine 10 mg',
    dosage: '10 mg',
    time: '08:00 PM',
    slot: 'Night' as const,
    days: ['Mon', 'Wed', 'Fri', 'Sun'],
    duration: '2 weeks',
  },
  {
    name: 'Hydrocortisone Cream',
    dosage: '1% topical',
    time: '02:00 PM',
    slot: 'Afternoon' as const,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    duration: '3 weeks',
  },
];

export const demoPrescriptions = [
  {
    id: 'rx-001',
    appointmentId: 'appt-demo-001',
    doctorName: 'Dr. Ananya Sharma',
    specialization: 'General Physician' as const,
    date: '2026-08-15',
    patientName: 'Demo Student',
    medicines: [
      { name: 'Paracetamol', dosage: '650 mg', frequency: 'After meals, 3x daily', duration: '5 days', instructions: 'Take with water. Do not exceed 4 tablets in 24 hours.' },
      { name: 'Vitamin C', dosage: '500 mg', frequency: 'Once daily, morning', duration: '15 days', instructions: 'Take on an empty stomach for better absorption.' },
    ],
    instructions: 'Rest well and stay hydrated. If fever persists beyond 3 days, schedule a follow-up consultation.',
  },
  {
    id: 'rx-002',
    appointmentId: 'appt-demo-002',
    doctorName: 'Dr. Rohan Kapoor',
    specialization: 'Dermatology' as const,
    date: '2026-08-28',
    patientName: 'Demo Student',
    medicines: [
      { name: 'Hydrocortisone Cream', dosage: '1% topical', frequency: 'Apply twice daily', duration: '3 weeks', instructions: 'Apply a thin layer on affected area. Avoid contact with eyes.' },
      { name: 'Cetirizine 10 mg', dosage: '10 mg', frequency: 'Once at night', duration: '2 weeks', instructions: 'May cause drowsiness. Take before bedtime.' },
    ],
    instructions: 'Avoid sun exposure during treatment. Use SPF 30+ sunscreen when going outdoors.',
  },
];

export const demoMoods = [
  { emoji: '😄', label: 'Great', color: 'bg-success-100 text-success-700 border-success-300' },
  { emoji: '🙂', label: 'Good', color: 'bg-primary-100 text-primary-700 border-primary-300' },
  { emoji: '😐', label: 'Okay', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { emoji: '😟', label: 'Low', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { emoji: '😣', label: 'Stressed', color: 'bg-danger-100 text-danger-700 border-danger-300' },
];

export const wellbeingResources = [
  {
    id: 'wb-1',
    title: 'Exam Stress Support',
    description: 'Guided breathing exercises, time management tips, and study-life balance strategies to help you through exam season.',
    icon: 'BookOpen',
    color: 'from-blue-500 to-indigo-600',
    items: [
      '4-7-8 Breathing Technique: Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 4 times.',
      'Break your study sessions into 25-minute focused blocks with 5-minute breaks (Pomodoro Technique).',
      'Prioritize sleep — 7-8 hours of rest improves memory retention by up to 40%.',
      'Talk to a friend or counsellor if you feel overwhelmed. You are not alone.',
    ],
  },
  {
    id: 'wb-2',
    title: 'Mental Wellness Resources',
    description: 'Self-care practices, mindfulness exercises, and professional support options for your mental wellbeing.',
    icon: 'Brain',
    color: 'from-violet-500 to-purple-600',
    items: [
      'Practice daily mindfulness: 10 minutes of meditation can reduce anxiety by up to 30%.',
      'Journal your thoughts before bed to improve sleep quality and emotional processing.',
      'Stay socially connected — regular interaction with friends boosts mood and reduces stress.',
      'If you experience persistent low mood, reach out to the Counselling & Happiness Cell.',
    ],
  },
  {
    id: 'wb-3',
    title: 'Sleep & Study Balance',
    description: 'Build healthy sleep habits and study routines that support both academic success and physical health.',
    icon: 'Moon',
    color: 'from-teal-500 to-cyan-600',
    items: [
      'Maintain a consistent sleep schedule — aim for 7-8 hours nightly.',
      'Avoid screens 30 minutes before bed; use blue light filters in the evening.',
      'Create a dedicated study space separate from your sleeping area.',
      'Exercise regularly — even 20 minutes of walking improves sleep quality.',
    ],
  },
  {
    id: 'wb-4',
    title: 'Counselling Support',
    description: 'Confidential, professional counselling services available on campus for all LPU students.',
    icon: 'HeartHandshake',
    color: 'from-rose-500 to-pink-600',
    items: [
      'Free, confidential counselling sessions at the Counselling & Happiness Cell.',
      'Walk-in support available Monday–Friday, 9 AM – 5 PM.',
      'Online counselling appointments can be booked through CampusCare.',
      'Crisis support is available 24/7 through the emergency helpline.',
    ],
  },
];

export const emergencyContacts = [
  {
    id: 'em-1',
    title: 'Campus Health Centre',
    number: '+91-98765-43210',
    description: 'Uni-Health Centre, Block 1, LPU Campus. Open 24/7 for medical emergencies.',
    icon: 'Building2',
    color: 'from-blue-500 to-blue-600',
    demo: true,
  },
  {
    id: 'em-2',
    title: 'Campus Security',
    number: '+91-98765-11111',
    description: 'LPU Campus Security. Available 24/7 for on-campus emergencies and assistance.',
    icon: 'Shield',
    color: 'from-indigo-500 to-indigo-600',
    demo: true,
  },
  {
    id: 'em-3',
    title: 'Emergency Help',
    number: '108',
    description: 'National Emergency Number. Call for ambulance, fire, or police emergencies.',
    icon: 'Siren',
    color: 'from-danger-500 to-red-600',
    demo: false,
  },
  {
    id: 'em-4',
    title: 'Nearest Hospital',
    number: '+91-181-223-0000',
    description: 'Apollo Hospitals, Phagwara. Approximately 3 km from LPU campus.',
    icon: 'Hospital',
    color: 'from-teal-500 to-cyan-600',
    demo: true,
  },
  {
    id: 'em-5',
    title: 'Counselling Support',
    number: '+91-98765-99999',
    description: 'Counselling & Happiness Cell, Block 27, LPU Campus. Confidential support.',
    icon: 'HeartHandshake',
    color: 'from-rose-500 to-pink-600',
    demo: true,
  },
];

export const lpuLocations = [
  {
    id: 'loc-1',
    name: 'Uni-Health Centre',
    type: 'Health Centre',
    description: 'Primary campus health facility with general physicians, basic lab tests, and emergency first aid.',
    lat: 31.2539,
    lng: 75.7050,
    icon: 'Building2',
    color: '#2563eb',
  },
  {
    id: 'loc-2',
    name: 'Hospital (Nearby)',
    type: 'Hospital',
    description: 'Apollo Hospitals Phagwara — multi-specialty hospital, approximately 3 km from campus.',
    lat: 31.2240,
    lng: 75.7640,
    icon: 'Hospital',
    color: '#0891b2',
  },
  {
    id: 'loc-3',
    name: 'Campus Medical Store',
    type: 'Pharmacy',
    description: '24/7 pharmacy inside Block 1, near the Uni-Health Centre. Stocked with common medicines.',
    lat: 31.2542,
    lng: 75.7048,
    icon: 'Pill',
    color: '#16a34a',
  },
  {
    id: 'loc-4',
    name: 'Counselling & Happiness Cell',
    type: 'Counselling',
    description: 'Confidential mental health support. Block 27, Ground Floor. Walk-in and appointment-based.',
    lat: 31.2535,
    lng: 75.7045,
    icon: 'HeartHandshake',
    color: '#e11d48',
  },
];

export const medicineCatalog = [
  { name: 'Paracetamol (Acetaminophen)', category: 'Pain Relief', use: 'Fever, headaches, body pain' },
  { name: 'Cetirizine 10 mg', category: 'Antihistamine', use: 'Allergies, sneezing, runny nose' },
  { name: 'Vitamin D3', category: 'Supplement', use: 'Vitamin D deficiency' },
  { name: 'Vitamin C', category: 'Supplement', use: 'Immunity support' },
  { name: 'Hydrocortisone Cream', category: 'Topical', use: 'Skin inflammation, rashes' },
  { name: 'Omeprazole 20 mg', category: 'Antacid', use: 'Acid reflux, indigestion' },
  { name: 'Ibuprofen 400 mg', category: 'Pain Relief', use: 'Pain, inflammation, fever' },
  { name: 'ORS Sachet', category: 'Rehydration', use: 'Dehydration, diarrhea' },
  { name: 'Azithromycin 500 mg', category: 'Antibiotic', use: 'Bacterial infections (prescription only)' },
  { name: 'Cough Syrup', category: 'Cold Relief', use: 'Dry cough, throat irritation' },
];
