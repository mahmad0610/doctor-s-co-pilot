import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Heart, Plus, FileText } from 'lucide-react';
import { usePatientAppointments } from '@/hooks/api/useAppointments';
import { useUserStore } from '@/stores/userStore';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-primary/10 text-primary',
  checked_in: 'bg-purple-100 text-purple-700',
};

export default function PatientAppointments() {
  const { patientId, setMockPatientId } = useUserStore();
  
  // Auto-set mock patient ID for MVP
  if (!patientId) {
    setMockPatientId();
  }

  const { data: appointments, isLoading } = usePatientAppointments(patientId || undefined);

  const upcomingAppointments = appointments?.filter(a => 
    ['pending', 'confirmed', 'scheduled'].includes(a.status)
  ) || [];
  
  const pastAppointments = appointments?.filter(a => 
    ['completed', 'cancelled'].includes(a.status)
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sehatly</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/doctors/search">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Book New
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

        {/* Upcoming */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Appointments
          </h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <Card key={appointment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            Dr. {appointment.clinician_name || 'Doctor'}
                          </h3>
                          <Badge className={statusColors[appointment.status]}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(appointment.scheduled_at), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(appointment.scheduled_at), 'h:mm a')}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{appointment.reason}</p>
                      </div>
                      
                      {appointment.status === 'confirmed' && (
                        <Link to={`/appointments/${appointment.id}/triage`}>
                          <Button className="gap-2">
                            <FileText className="h-4 w-4" />
                            Start Triage
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No upcoming appointments</p>
                <Link to="/doctors/search">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Book an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Past Appointments</h2>
            <div className="space-y-4">
              {pastAppointments.map(appointment => (
                <Card key={appointment.id} className="opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            Dr. {appointment.clinician_name || 'Doctor'}
                          </h3>
                          <Badge variant="outline" className={statusColors[appointment.status]}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(appointment.scheduled_at), 'MMM d, yyyy • h:mm a')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
