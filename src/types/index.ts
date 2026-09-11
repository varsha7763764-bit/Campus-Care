export type Specialization =
  | 'General Physician'
  | 'Dermatology'
  | 'Dental'
  | 'Eye Care'
  | 'Mental Wellness'
  | 'Gynecology';

export type ConsultationType = 'Online' | 'Offline';

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Doctor {
  id: string;
  name: string;
  specialization: Specialization;
  experience: number;
  rating: number;
  reviews: number;
  consultationType: ConsultationType[];
  about: string;
  education: string;
  languages: string[];
  fee: number;
  slots: { day: string; times: string[] }[];
  avatarColor: string;
  initials: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: Specialization;
  date: string;
  time: string;
  type: ConsultationType;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  specialization: Specialization;
  date: string;
  patientName: string;
  medicines: PrescriptionMedicine[];
  instructions: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface RoutineMedicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  slot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  days: string[];
  duration: string;
  taken: boolean[];
  prescriptionId?: string;
}

export interface CareTeamMember {
  doctorId: string;
  lastConsultation: string;
  lastDate: string;
}

export interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

export type PageKey =
  | 'dashboard'
  | 'find-doctor'
  | 'doctor-profile'
  | 'appointments'
  | 'medical-routine'
  | 'care-team'
  | 'medicines'
  | 'wellbeing'
  | 'emergency'
  | 'lpu-healthcare'
  | 'consultation'
  | 'prescription';

export interface NavItem {
  key: PageKey;
  label: string;
  icon: string;
}
