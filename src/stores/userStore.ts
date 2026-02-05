// User Store for Sehatly MVP
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserType } from '@/types';

interface UserState {
  // User identifiers (linked to backend)
  patientId: string | null;
  clinicianId: string | null;
  userType: UserType;
  
  // Actions
  setPatientId: (id: string | null) => void;
  setClinicianId: (id: string | null) => void;
  setUserType: (type: UserType) => void;
  
  // Dev helpers
  setMockPatientId: () => void;
  setMockClinicianId: () => void;
  
  // Reset
  clear: () => void;
}

// Mock IDs for development
const MOCK_PATIENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const MOCK_CLINICIAN_ID = 'c1d2e3f4-a5b6-7890-cdef-ab1234567890';

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      patientId: null,
      clinicianId: null,
      userType: null,
      
      setPatientId: (id) => set({ patientId: id }),
      setClinicianId: (id) => set({ clinicianId: id }),
      setUserType: (type) => set({ userType: type }),
      
      setMockPatientId: () => set({ 
        patientId: MOCK_PATIENT_ID, 
        userType: 'patient' 
      }),
      setMockClinicianId: () => set({ 
        clinicianId: MOCK_CLINICIAN_ID, 
        userType: 'clinician' 
      }),
      
      clear: () => set({ 
        patientId: null, 
        clinicianId: null, 
        userType: null 
      }),
    }),
    {
      name: 'sehatly-user-store',
    }
  )
);
