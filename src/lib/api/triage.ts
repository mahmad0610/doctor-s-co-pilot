// Triage API Service
import { apiClient } from './client';
import type { TriageSession, TriageQuestion, TriageView } from '@/types';

export async function startTriageSession(
  appointmentId: string,
  chiefComplaint?: string
): Promise<TriageSession> {
  return apiClient.post<TriageSession>('/triage-sessions/', {
    appointment_id: appointmentId,
    chief_complaint: chiefComplaint,
  });
}

export async function getTriageQuestions(sessionId: string): Promise<TriageQuestion[]> {
  return apiClient.get<TriageQuestion[]>(`/triage-sessions/${sessionId}/questions`);
}

export async function submitTriageAnswers(
  sessionId: string,
  answers: Record<string, string>
): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(`/triage-sessions/${sessionId}/answers`, {
    answers,
  });
}

export async function getClinicianTriageView(
  appointmentId: string,
  clinicianId: string
): Promise<TriageView> {
  return apiClient.get<TriageView>(`/triage-sessions/clinician/appointment/${appointmentId}`, {
    params: { clinician_id: clinicianId },
  });
}
