
# Backend Integration Plan for Sehatly MVP

## Overview
This plan integrates the existing React frontend with the FastAPI backend. The platform will support three user types: **Patients**, **Clinicians (Doctors)**, and handle the complete booking-to-consultation flow.

---

## Phase 1: API Client Infrastructure

### 1.1 Create API Client (`src/lib/api/client.ts`)
- Base URL from `VITE_API_URL` environment variable (default: `http://localhost:8000`)
- Request/response interceptors for error handling
- Auto-toast notifications on errors (409 Conflict = "Slot taken")
- Prepare for future JWT Authorization header

### 1.2 Update Environment Configuration
Add to `.env.example`:
```
VITE_API_URL=http://localhost:8000
```

---

## Phase 2: Type System Alignment

### 2.1 Update Types (`src/types/index.ts`)
Map OpenAPI schemas to TypeScript interfaces:

| Backend Schema | Frontend Type |
|----------------|---------------|
| Clinician | Clinician |
| Appointment | Appointment (updated) |
| AppointmentCreate | AppointmentCreate |
| ChatMessage | ChatMessage |
| TriageSession | TriageSession |

New types to add:
- `Clinician` - doctor profile with specialty, rating, fee
- `Slot` - availability time slots
- `TriageSession` - triage context with urgency_score, red_flags
- `TriageView` - combined patient_info, triage, chat_history
- Update `Appointment` to match backend status enum

---

## Phase 3: API Service Layer

### 3.1 Create Service Files

```
src/lib/api/
├── client.ts           # Base axios/fetch configuration
├── clinicians.ts       # Clinician endpoints
├── appointments.ts     # Appointment CRUD
├── chat.ts             # AI chat endpoint
└── triage.ts           # Triage session endpoints
```

### 3.2 Clinicians Service (`src/lib/api/clinicians.ts`)
```text
searchClinicians(specialty?, city?, accepting_new?, min_rating?) → Clinician[]
getClinicianById(id) → Clinician
getClinicianAvailability(id, start_date?, days_ahead?) → Slot[]
```

### 3.3 Appointments Service (`src/lib/api/appointments.ts`)
```text
createAppointment(data: AppointmentCreate) → Appointment
listAppointments(patient_id?, clinician_id?, status?) → Appointment[]
getAppointment(id) → Appointment
updateAppointmentStatus(id, status) → Appointment
getPendingAppointments(clinician_id) → Appointment[]
```

### 3.4 Chat Service (`src/lib/api/chat.ts`)
```text
sendMessage(patient_id, message, session_id?) → { reply, session_id, total_messages }
```

### 3.5 Triage Service (`src/lib/api/triage.ts`)
```text
startTriageSession(appointment_id, chief_complaint?) → TriageSession
getTriageQuestions(session_id) → Question[]
submitTriageAnswers(session_id, answers) → { message }
getClinicianTriageView(appointment_id, clinician_id) → TriageView
```

---

## Phase 4: React Query Integration

### 4.1 Create Query Hooks (`src/hooks/api/`)

```
src/hooks/api/
├── useClinicians.ts      # Search, details, availability
├── useAppointments.ts    # CRUD + pending list
├── useChat.ts            # AI chat mutation
└── useTriage.ts          # Triage session management
```

### 4.2 Query Keys Structure
```text
['clinicians', filters]           → Search results
['clinicians', id]                → Single clinician
['clinicians', id, 'availability'] → Slots
['appointments', filters]          → Patient/clinician appointments
['appointments', 'pending', clinician_id]
['triage', appointment_id]         → Clinician triage view
```

---

## Phase 5: User/Auth Store Enhancement

### 5.1 Create User Store (`src/stores/userStore.ts`)
Using Zustand or React Context:
- `patientId: string | null`
- `clinicianId: string | null`
- `userType: 'patient' | 'clinician' | null`
- Persist to localStorage for MVP
- Ready for JWT integration later

### 5.2 Update AuthContext
- After Firebase auth, determine user type
- Store patient/clinician ID
- Add mock ID toggle for development

---

## Phase 6: Page Updates

### 6.1 Patient List (`src/pages/PatientList.tsx`)
**Current**: Uses `mockPatients`
**Update**:
- For clinician view: Fetch from triage endpoint to get patient list
- Add filter by appointment status
- Remove mock data usage

### 6.2 Patient Detail (`src/pages/PatientDetail.tsx`)
**Current**: Uses `mockTriageBriefs`, `mockCarePlans`
**Update**:
- Call `getClinicianTriageView(appointment_id, clinician_id)`
- Display real triage data: urgency_score, red_flags, chat_history
- Map backend response to UI components

### 6.3 Scheduling Hub (`src/pages/SchedulingHub.tsx`)
**Current**: Mock appointments with drag-drop
**Update**:
- Use `getClinicianAvailability()` for slots
- Call `createAppointment()` on drop
- Handle 409 Conflict ("Slot already taken")
- Refresh appointments list after booking

### 6.4 Messaging Center (`src/pages/MessagingCenter.tsx`)
**Current**: Mock messages
**Update**:
- Integrate `/chat/agent` endpoint
- Send messages via `sendMessage()` mutation
- Display AI replies with session management
- Store session_id for conversation continuity

### 6.5 AI Alert Triage (`src/pages/AIAlertTriage.tsx`)
**Current**: Mock recommendations
**Update**:
- Fetch triage sessions with red_flags
- Display urgency_score as confidence meter
- Map red_flags to actionable alerts

### 6.6 Care Plan Editor (`src/pages/CarePlanEditor.tsx`)
**Current**: Mock care plans
**Update**:
- Prepare for future care plan API
- Keep current structure for MVP demo
- Note: Backend care plan endpoints not in OpenAPI spec yet

---

## Phase 7: New Patient-Facing Components

Since this is a unified platform (landing + patient dashboard + doctor dashboard):

### 7.1 Landing Page (`src/pages/Landing.tsx`)
- Hero section with platform overview
- "I'm a Patient" / "I'm a Doctor" CTA buttons
- Search doctors preview

### 7.2 Doctor Search Page (`src/pages/DoctorSearch.tsx`)
- Search input (specialty, city)
- Filter chips (min_rating, accepting_new)
- Clinician cards with booking button
- Uses `searchClinicians()` query

### 7.3 Booking Modal Component
- Show clinician availability slots
- Select time → create appointment
- Handle success/conflict responses

### 7.4 Patient Appointments Page
- List patient's appointments
- Status badges (pending, confirmed, etc.)
- "Start Triage" button for confirmed appointments

### 7.5 Triage Wizard Component
- Step-by-step question flow
- Uses `getTriageQuestions()` and `submitTriageAnswers()`
- Progress indicator

---

## Phase 8: Route Structure Update

```text
/                         → Landing (public)
/login                    → Auth (existing)
/doctors/search           → DoctorSearch (patient)
/doctors/:id              → DoctorProfile (patient)
/my-appointments          → PatientAppointments (patient)
/appointments/:id/triage  → TriageWizard (patient)
/dashboard                → ClinicianDashboard (clinician)
/patients                 → PatientList (clinician) - existing
/patients/:id             → PatientDetail (clinician) - existing
/scheduling               → SchedulingHub (clinician) - existing
...other existing routes
```

---

## Technical Implementation Summary

| Component | API Endpoint | React Query Key |
|-----------|--------------|-----------------|
| DoctorSearch | GET /clinicians/search | ['clinicians', filters] |
| DoctorProfile | GET /clinicians/{id} | ['clinicians', id] |
| SlotPicker | GET /clinicians/{id}/availability | ['clinicians', id, 'availability'] |
| BookingModal | POST /appointments/ | mutation |
| PatientAppointments | GET /appointments/?patient_id | ['my-appointments'] |
| ClinicianDashboard | GET /appointments/pending | ['clinician-appointments'] |
| AppointmentAction | PATCH /appointments/{id} | mutation + invalidate |
| ChatWindow | POST /chat/agent | mutation |
| TriageWizard | POST/GET triage-sessions/* | ['triage-questions', sid] |
| PatientDetail | GET triage-sessions/clinician/appointment/{id} | ['triage', appointment_id] |

---

## File Creation Summary

**New Files:**
- `src/lib/api/client.ts`
- `src/lib/api/clinicians.ts`
- `src/lib/api/appointments.ts`
- `src/lib/api/chat.ts`
- `src/lib/api/triage.ts`
- `src/hooks/api/useClinicians.ts`
- `src/hooks/api/useAppointments.ts`
- `src/hooks/api/useChat.ts`
- `src/hooks/api/useTriage.ts`
- `src/stores/userStore.ts`
- `src/pages/Landing.tsx`
- `src/pages/DoctorSearch.tsx`
- `src/pages/DoctorProfile.tsx`
- `src/pages/PatientAppointments.tsx`
- `src/pages/TriageWizard.tsx`
- `src/components/BookingModal.tsx`
- `src/components/ClinicianCard.tsx`
- `src/components/SlotPicker.tsx`

**Updated Files:**
- `src/types/index.ts` - add backend types
- `src/App.tsx` - add new routes
- `src/pages/PatientList.tsx` - use real API
- `src/pages/PatientDetail.tsx` - use triage API
- `src/pages/SchedulingHub.tsx` - use appointments API
- `src/pages/MessagingCenter.tsx` - use chat API
- `src/pages/AIAlertTriage.tsx` - use triage data
- `src/contexts/AuthContext.tsx` - add user type handling
- `.env.example` - add VITE_API_URL

---

## Error Handling Strategy

- **409 Conflict**: "This slot is no longer available"
- **404 Not Found**: "Resource not found"
- **401 Unauthorized**: Redirect to login (future JWT)
- **500 Server Error**: "Something went wrong, please try again"
- All errors display via `toast.error()`
