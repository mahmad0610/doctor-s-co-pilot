// React Query hooks for Clinicians API
import { useQuery } from '@tanstack/react-query';
import { searchClinicians, getClinicianById, getClinicianAvailability } from '@/lib/api/clinicians';
import type { ClinicianSearchParams } from '@/types';

export function useSearchClinicians(params?: ClinicianSearchParams, enabled = true) {
  return useQuery({
    queryKey: ['clinicians', params],
    queryFn: () => searchClinicians(params),
    enabled,
  });
}

export function useClinician(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['clinicians', id],
    queryFn: () => getClinicianById(id!),
    enabled: !!id && enabled,
  });
}

export function useClinicianAvailability(
  clinicianId: string | undefined,
  startDate?: string,
  daysAhead?: number,
  enabled = true
) {
  return useQuery({
    queryKey: ['clinicians', clinicianId, 'availability', startDate, daysAhead],
    queryFn: () => getClinicianAvailability(clinicianId!, startDate, daysAhead),
    enabled: !!clinicianId && enabled,
  });
}
