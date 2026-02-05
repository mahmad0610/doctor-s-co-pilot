import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SlotPicker } from './SlotPicker';
import { useCreateAppointment } from '@/hooks/api/useAppointments';
import { useUserStore } from '@/stores/userStore';
import type { Clinician, Slot } from '@/types';
import { Loader2, Calendar, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  clinician: Clinician | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BookingModal({ clinician, open, onOpenChange, onSuccess }: BookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'slot' | 'details' | 'success'>('slot');
  
  const { patientId } = useUserStore();
  const createAppointment = useCreateAppointment();

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (selectedSlot) {
      setStep('details');
    }
  };

  const handleBook = async () => {
    if (!clinician || !selectedSlot || !patientId) return;

    try {
      await createAppointment.mutateAsync({
        patient_id: patientId,
        clinician_id: clinician.id,
        scheduled_at: selectedSlot.time,
        reason: reason || 'General consultation',
        duration_minutes: selectedSlot.duration_minutes,
      });

      setStep('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleClose = () => {
    setStep('slot');
    setSelectedSlot(null);
    setReason('');
    onOpenChange(false);
  };

  if (!clinician) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment with Dr. {clinician.full_name}
          </DialogTitle>
          <DialogDescription>
            {step === 'slot' && 'Select a convenient time for your appointment'}
            {step === 'details' && 'Provide details for your visit'}
            {step === 'success' && 'Your appointment has been booked!'}
          </DialogDescription>
        </DialogHeader>

        {step === 'slot' && (
          <>
            <SlotPicker
              clinicianId={clinician.id}
              onSelectSlot={handleSelectSlot}
              selectedSlot={selectedSlot}
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleContinue} disabled={!selectedSlot}>
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'details' && (
          <>
            <div className="space-y-4">
              <div>
                <Label>Reason for Visit</Label>
                <Textarea
                  placeholder="Describe your symptoms or reason for the appointment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Selected Time</div>
                <div className="font-medium">
                  {selectedSlot && new Date(selectedSlot.time).toLocaleString()}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('slot')}>
                Back
              </Button>
              <Button 
                onClick={handleBook} 
                disabled={createAppointment.isPending}
              >
                {createAppointment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="flex flex-col items-center py-8">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Appointment Booked!</h3>
              <p className="text-muted-foreground text-center">
                Your appointment with Dr. {clinician.full_name} is pending confirmation.
                You'll receive a notification once confirmed.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
