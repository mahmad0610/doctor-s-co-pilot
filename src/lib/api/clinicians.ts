// Clinicians API Service
import { apiClient } from './client';
import type { Clinician, ClinicianSearchParams, Slot } from '@/types';

export async function searchClinicians(params?: ClinicianSearchParams): Promise<Clinician[]> {
  return apiClient.get<Clinician[]>('/clinicians/search', { 
    params: params as Record<string, string | number | boolean | undefined>
  });
}
export async function getClinicianById(id: string): Promise<Clinician> {
  return apiClient.get<Clinician>(`/clinicians/${id}`);
}

export async function getClinicianAvailability(
  id: string,
  startDate?: string,
  daysAhead?: number
): Promise<Slot[]> {
  return apiClient.get<Slot[]>(`/clinicians/${id}/availability`, {
    params: {
      start_date: startDate,
      days_ahead: daysAhead,
    },
  });
}
