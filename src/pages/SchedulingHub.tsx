import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPatients, mockAppointments } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function SchedulingHub() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [draggedPatient, setDraggedPatient] = useState<string | null>(null);

  const handleDragStart = (patientId: string) => {
    setDraggedPatient(patientId);
  };

  const handleDrop = (timeSlot: string) => {
    if (draggedPatient) {
      const patient = mockPatients.find(p => p.id === draggedPatient);
      toast.success(`Scheduled ${patient?.name} for ${timeSlot}`);
      setDraggedPatient(null);
    }
  };

  const timeSlots = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);

  return (
    <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Patients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockPatients.map(patient => (
                  <div
                    key={patient.id}
                    draggable
                    onDragStart={() => handleDragStart(patient.id)}
                    className="p-3 border rounded-lg cursor-move hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">{patient.age} yrs • {patient.gender}</div>
                    <Badge variant="outline" className="mt-1">{patient.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timeSlots.map(slot => {
                    const appointment = mockAppointments.find(
                      a => format(a.start, 'H:00') === slot
                    );
                    
                    return (
                      <div
                        key={slot}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(slot)}
                        className="p-4 border rounded-lg min-h-[80px] hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{slot}</div>
                          {appointment ? (
                            <div className="flex-1 ml-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{appointment.patientName}</div>
                                  <div className="text-sm text-muted-foreground capitalize">{appointment.type}</div>
                                </div>
                                <Badge>{appointment.status}</Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Drop patient here</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
