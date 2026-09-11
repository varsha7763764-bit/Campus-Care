import { AppProvider, useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { FindDoctor } from '@/pages/FindDoctor';
import { DoctorProfile } from '@/pages/DoctorProfile';
import { Appointments } from '@/pages/Appointments';
import { Consultation } from '@/pages/Consultation';
import { Prescription } from '@/pages/Prescription';
import { MedicalRoutine } from '@/pages/MedicalRoutine';
import { CareTeam } from '@/pages/CareTeam';
import { Medicines } from '@/pages/Medicines';
import { Wellbeing } from '@/pages/Wellbeing';
import { Emergency } from '@/pages/Emergency';
import { LPUHealthcare } from '@/pages/LPUHealthcare';

function PageRouter() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'dashboard': return <Dashboard />;
    case 'find-doctor': return <FindDoctor />;
    case 'doctor-profile': return <DoctorProfile />;
    case 'appointments': return <Appointments />;
    case 'consultation': return <Consultation />;
    case 'prescription': return <Prescription />;
    case 'medical-routine': return <MedicalRoutine />;
    case 'care-team': return <CareTeam />;
    case 'medicines': return <Medicines />;
    case 'wellbeing': return <Wellbeing />;
    case 'emergency': return <Emergency />;
    case 'lpu-healthcare': return <LPUHealthcare />;
    default: return <Dashboard />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <PageRouter />
      </Layout>
    </AppProvider>
  );
}
