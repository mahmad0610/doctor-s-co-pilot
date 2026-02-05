// Chat API Service
import { apiClient } from './client';
import type { ChatResponse } from '@/types';

export async function sendMessage(
  patientId: string,
  message: string,
  sessionId?: string | null
): Promise<ChatResponse> {
  return apiClient.post<ChatResponse>('/chat/agent', {
    patient_id: patientId,
    message,
    session_id: sessionId,
  });
}
