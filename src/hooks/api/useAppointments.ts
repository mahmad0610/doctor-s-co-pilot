// React Query hooks for Appointments API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointmentStatus,
  getPendingAppointments,
} from '@/lib/api/appointments';
import type { AppointmentCreate, AppointmentStatus } from '@/types';
import { toast } from 'sonner';

export function useAppointments(params?: {
  patient_id?: string;
  clinician_id?: string;
  status?: AppointmentStatus;
}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => listAppointments(params),
    enabled: true,
  });
}

export function usePatientAppointments(patientId: string | undefined) {
  return useQuery({
    queryKey: ['my-appointments', patientId],
    queryFn: () => listAppointments({ patient_id: patientId }),
    enabled: !!patientId,
  });
}

export function useClinicianAppointments(clinicianId: string | undefined, status?: AppointmentStatus) {
  return useQuery({
    queryKey: ['clinician-appointments', clinicianId, status],
    queryFn: () => listAppointments({ clinician_id: clinicianId, status }),
    enabled: !!clinicianId,
  });
}

export function usePendingAppointments(clinicianId: string | undefined) {
  return useQuery({
    queryKey: ['appointments', 'pending', clinicianId],
    queryFn: () => getPendingAppointments(clinicianId!),
    enabled: !!clinicianId,
  });
}

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => getAppointment(id!),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AppointmentCreate) => createAppointment(data),
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['clinician-appointments'] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      updateAppointmentStatus(id, status),
    onSuccess: (_, variables) => {
      const statusMessages: Record<AppointmentStatus, string> = {
        confirmed: 'Appointment confirmed!',
        cancelled: 'Appointment cancelled',
        completed: 'Appointment marked as completed',
        checked_in: 'Patient checked in',
        scheduled: 'Appointment scheduled',
        pending: 'Appointment pending',
      };
      toast.success(statusMessages[variables.status] || 'Appointment updated');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['clinician-appointments'] });
    },
  });
}
