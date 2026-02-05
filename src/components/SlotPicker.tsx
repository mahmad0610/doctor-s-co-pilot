import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';
import { useClinicianAvailability } from '@/hooks/api/useClinicians';
import type { Slot } from '@/types';

interface SlotPickerProps {
  clinicianId: string;
  onSelectSlot: (slot: Slot) => void;
  selectedSlot?: Slot | null;
}

export function SlotPicker({ clinicianId, onSelectSlot, selectedSlot }: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: slots, isLoading } = useClinicianAvailability(
    clinicianId,
    selectedDate.toISOString(),
    7
  );

  // Filter slots for selected date
  const slotsForDate = slots?.filter(slot => {
    const slotDate = new Date(slot.time);
    return slotDate.toDateString() === selectedDate.toDateString();
  }) || [];

  const availableSlots = slotsForDate.filter(slot => slot.available);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Available Times for {format(selectedDate, 'MMM d')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No available slots for this date
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot, index) => {
                const isSelected = selectedSlot?.time === slot.time;
                return (
                  <Button
                    key={index}
                    variant={isSelected ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => onSelectSlot(slot)}
                  >
                    {format(new Date(slot.time), 'h:mm a')}
                    <Badge variant="secondary" className="ml-auto">
                      {slot.duration_minutes} min
                    </Badge>
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
