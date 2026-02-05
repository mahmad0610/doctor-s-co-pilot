// Core Types for Sehatly Doctor Dashboard

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type PatientStatus = 'urgent' | 'today' | 'stable' | 'archived';
export type AppRole = 'doctor' | 'nurse' | 'admin' | 'patient';
export type UserType = 'patient' | 'clinician' | null;

// ===================
// User & Auth Types
// ===================

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: AppRole;
  photoURL?: string;
  patientId?: string;
  clinicianId?: string;
}

// ===================
// Clinician Types (from OpenAPI)
// ===================

export interface ClinicianAddress {
  city: string;
  state: string;
}

export interface Clinician {
  id: string;
  full_name: string;
  specialty: string;
  rating: number;
  years_experience: number;
  consultation_fee: number;
  accepting_new_patients: boolean;
  address: ClinicianAddress;
}

export interface Slot {
  time: string; // ISO date-time
  available: boolean;
  duration_minutes: number;
}

export interface ClinicianSearchParams {
  specialty?: string;
  city?: string;
  accepting_new?: boolean;
  min_rating?: number;
}

// ===================
// Appointment Types (from OpenAPI)
// ===================

export type AppointmentStatus = 'scheduled' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'checked_in';

export interface AppointmentCreate {
  patient_id: string;
  clinician_id: string;
  scheduled_at: string; // ISO date-time
  reason: string;
  duration_minutes?: number;
}

export interface Appointment {
  id: string;
  patient_id: string;
  clinician_id: string;
  scheduled_at: string;
  reason: string;
  duration_minutes: number;
  status: AppointmentStatus;
  created_at: string;
  // Extended fields for UI
  patient_name?: string;
  clinician_name?: string;
}

// ===================
// Chat Types (from OpenAPI)
// ===================

export interface ChatMessageRequest {
  patient_id: string;
  message: string;
  session_id?: string | null;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  total_messages: number;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ===================
// Triage Types (from OpenAPI)
// ===================

export interface TriageSessionCreate {
  appointment_id: string;
  chief_complaint?: string;
}

export interface TriageSession {
  id: string;
  appointment_id: string;
  status: string;
  patient_context: Record<string, unknown>;
}

export interface TriageQuestion {
  id: string;
  text: string;
  type: string;
}

export interface TriageAnswers {
  answers: Record<string, string>;
}

export interface PatientInfo {
  full_name: string;
  age: number;
  gender: string;
}

export interface TriageData {
  id: string;
  urgency_score: number;
  red_flags: string[];
  notes: string;
  summary: string;
}

export interface TriageView {
  patient_info: PatientInfo;
  triage: TriageData;
  chat_history: ChatHistoryMessage[];
}

// ===================
// Legacy Types (for existing UI components)
// ===================

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  status: PatientStatus;
  unreadMessages: number;
  lastVisit: Date;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenLevel: number;
  };
  conditions: string[];
  medications: string[];
  avatar?: string;
}

export interface AITriageBrief {
  id: string;
  patientId: string;
  generatedAt: Date;
  confidence: number;
  summary: string;
  recommendations: string[];
  flags: {
    severity: 'low' | 'medium' | 'high';
    message: string;
  }[];
}

export interface CarePlan {
  id: string;
  patientId: string;
  createdAt: Date;
  createdBy: string;
  lastModified: Date;
  confidence: number;
  status: 'draft' | 'signed' | 'active';
  timeline: CarePlanDay[];
  drugInteractions: DrugInteraction[];
}

export interface CarePlanDay {
  day: number;
  date: Date;
  activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'medication' | 'exercise' | 'diet' | 'checkup' | 'test';
  title: string;
  description: string;
  time?: string;
  completed?: boolean;
}

export interface DrugInteraction {
  severity: 'minor' | 'moderate' | 'severe';
  drugs: string[];
  description: string;
  recommendation: string;
}

export interface AIRecommendation {
  id: string;
  type: 'diagnosis' | 'treatment' | 'referral' | 'alert';
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
  status: 'pending' | 'approved' | 'dismissed';
}

export interface Message {
  id: string;
  patientId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  aiSuggestedReply?: string;
}

export interface VitalsTimeline {
  date: Date;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenLevel: number;
}
