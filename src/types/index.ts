// Core Types for Sehatly Doctor Dashboard

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type PatientStatus = 'urgent' | 'today' | 'stable' | 'archived';
export type AppRole = 'doctor' | 'nurse' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: AppRole;
  photoURL?: string;
}

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

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  start: Date;
  end: Date;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
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
