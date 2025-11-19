import { 
  Patient, 
  AITriageBrief, 
  CarePlan, 
  AIRecommendation, 
  Appointment,
  Message,
  VitalsTimeline
} from '@/types';
import { addDays, subDays } from 'date-fns';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'female',
    status: 'urgent',
    unreadMessages: 3,
    lastVisit: subDays(new Date(), 2),
    vitals: {
      heartRate: 88,
      bloodPressure: '140/90',
      temperature: 98.6,
      oxygenLevel: 96,
    },
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 62,
    gender: 'male',
    status: 'today',
    unreadMessages: 1,
    lastVisit: subDays(new Date(), 7),
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 98.4,
      oxygenLevel: 98,
    },
    conditions: ['Asthma'],
    medications: ['Albuterol inhaler'],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 34,
    gender: 'female',
    status: 'stable',
    unreadMessages: 0,
    lastVisit: subDays(new Date(), 14),
    vitals: {
      heartRate: 68,
      bloodPressure: '118/75',
      temperature: 98.2,
      oxygenLevel: 99,
    },
    conditions: ['Anxiety'],
    medications: ['Sertraline 50mg'],
  },
];

export const mockTriageBriefs: Record<string, AITriageBrief> = {
  '1': {
    id: 'triage-1',
    patientId: '1',
    generatedAt: new Date(),
    confidence: 75,
    summary: 'Patient showing elevated blood pressure readings over the past 3 days. Recent medication adherence at 85%. Blood glucose levels trending higher than target range.',
    recommendations: [
      'Consider adjusting Lisinopril dosage',
      'Schedule follow-up BP monitoring',
      'Review diabetes management plan',
      'Dietary consultation recommended',
    ],
    flags: [
      {
        severity: 'high',
        message: 'Blood pressure readings consistently above target (140/90)',
      },
      {
        severity: 'medium',
        message: 'Medication adherence below optimal (85%)',
      },
    ],
  },
  '2': {
    id: 'triage-2',
    patientId: '2',
    generatedAt: new Date(),
    confidence: 92,
    summary: 'Asthma control stable. Recent peak flow readings within normal range. No emergency inhaler use in past 2 weeks.',
    recommendations: [
      'Continue current medication regimen',
      'Schedule routine follow-up in 3 months',
    ],
    flags: [],
  },
};

export const mockCarePlans: Record<string, CarePlan> = {
  '1': {
    id: 'plan-1',
    patientId: '1',
    createdAt: subDays(new Date(), 1),
    createdBy: 'AI Engine',
    lastModified: new Date(),
    confidence: 75,
    status: 'draft',
    timeline: [
      {
        day: 1,
        date: new Date(),
        activities: [
          {
            id: 'act-1',
            type: 'medication',
            title: 'Metformin 500mg',
            description: 'Take with breakfast',
            time: '08:00',
          },
          {
            id: 'act-2',
            type: 'test',
            title: 'Blood Glucose Check',
            description: 'Fasting blood glucose',
            time: '07:00',
          },
        ],
      },
      {
        day: 2,
        date: addDays(new Date(), 1),
        activities: [
          {
            id: 'act-3',
            type: 'medication',
            title: 'Lisinopril 15mg (ADJUSTED)',
            description: 'Increased dosage - monitor for dizziness',
            time: '08:00',
          },
          {
            id: 'act-4',
            type: 'checkup',
            title: 'Blood Pressure Monitoring',
            description: 'Home BP check - morning and evening',
          },
        ],
      },
    ],
    drugInteractions: [
      {
        severity: 'moderate',
        drugs: ['Lisinopril', 'Potassium supplements'],
        description: 'ACE inhibitors can increase potassium levels',
        recommendation: 'Monitor potassium levels if patient takes supplements',
      },
    ],
  },
};

export const mockRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    type: 'diagnosis',
    title: 'Consider Pre-hypertension Assessment',
    description: 'Patient Sarah Johnson showing borderline readings',
    confidence: 78,
    evidence: [
      'BP readings: 140/90, 138/88, 142/91 over 3 days',
      'Family history of cardiovascular disease',
    ],
    status: 'pending',
  },
  {
    id: 'rec-2',
    type: 'treatment',
    title: 'Dosage Adjustment Recommended',
    description: 'Increase Lisinopril from 10mg to 15mg',
    confidence: 82,
    evidence: [
      'Current dosage suboptimal for BP control',
      'No adverse effects reported at current dose',
      'Similar patients respond well to 15mg',
    ],
    status: 'pending',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 30, 0, 0)),
    type: 'follow-up',
    status: 'scheduled',
    notes: 'Review BP management',
  },
  {
    id: 'appt-2',
    patientId: '2',
    patientName: 'Michael Chen',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(14, 30, 0, 0)),
    type: 'consultation',
    status: 'scheduled',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    patientId: '1',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: "I've been feeling dizzy in the mornings. Should I be concerned?",
    timestamp: subDays(new Date(), 1),
    read: false,
    aiSuggestedReply: "Thank you for reaching out. Dizziness can be related to your blood pressure. Let's schedule a check-up to monitor your vitals.",
  },
  {
    id: 'msg-2',
    patientId: '1',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: 'Also, I forgot to take my evening medication yesterday.',
    timestamp: subDays(new Date(), 1),
    read: false,
  },
];

export const mockVitalsTimeline: VitalsTimeline[] = Array.from({ length: 7 }, (_, i) => ({
  date: subDays(new Date(), 6 - i),
  heartRate: 70 + Math.floor(Math.random() * 20),
  bloodPressure: `${120 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
  temperature: 98 + Math.random() * 1.5,
  oxygenLevel: 96 + Math.floor(Math.random() * 3),
}));
