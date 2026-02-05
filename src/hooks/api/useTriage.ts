// React Query hooks for Triage API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  startTriageSession,
  getTriageQuestions,
  submitTriageAnswers,
  getClinicianTriageView,
} from '@/lib/api/triage';
import { toast } from 'sonner';

export function useTriageView(appointmentId: string | undefined, clinicianId: string | undefined) {
  return useQuery({
    queryKey: ['triage', appointmentId],
    queryFn: () => getClinicianTriageView(appointmentId!, clinicianId!),
    enabled: !!appointmentId && !!clinicianId,
  });
}

export function useTriageQuestions(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['triage-questions', sessionId],
    queryFn: () => getTriageQuestions(sessionId!),
    enabled: !!sessionId,
  });
}

export function useStartTriageSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appointmentId, chiefComplaint }: { appointmentId: string; chiefComplaint?: string }) =>
      startTriageSession(appointmentId, chiefComplaint),
    onSuccess: () => {
      toast.success('Triage session started');
      queryClient.invalidateQueries({ queryKey: ['triage'] });
    },
  });
}

export function useSubmitTriageAnswers() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, answers }: { sessionId: string; answers: Record<string, string> }) =>
      submitTriageAnswers(sessionId, answers),
    onSuccess: () => {
      toast.success('Triage answers submitted');
      queryClient.invalidateQueries({ queryKey: ['triage'] });
    },
  });
}
