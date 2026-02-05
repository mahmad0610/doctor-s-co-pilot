// Appointments API Service
import { apiClient } from './client';
import type { Appointment, AppointmentCreate, AppointmentStatus } from '@/types';

export async function createAppointment(data: AppointmentCreate): Promise<Appointment> {
  return apiClient.post<Appointment>('/appointments/', data);
}

export async function listAppointments(params?: {
  patient_id?: string;
  clinician_id?: string;
  status?: AppointmentStatus;
}): Promise<Appointment[]> {
  return apiClient.get<Appointment[]>('/appointments/', { params });
}

export async function getAppointment(id: string): Promise<Appointment> {
  return apiClient.get<Appointment>(`/appointments/${id}`);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment> {
  return apiClient.patch<Appointment>(`/appointments/${id}`, { status });
}

export async function getPendingAppointments(clinicianId: string): Promise<Appointment[]> {
  return apiClient.get<Appointment[]>('/appointments/pending', {
    params: { clinician_id: clinicianId },
  });
}
