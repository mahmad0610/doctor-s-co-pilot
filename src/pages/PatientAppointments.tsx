import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  Heart,
  Plus,
  FileText,
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { usePatientAppointments } from '@/hooks/api/useAppointments';
import { useUserStore } from '@/stores/userStore';
import { format, isPast, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import type { Appointment } from '@/types';

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  pending: { color: 'bg-warning/10 text-warning border-warning/20', icon: AlertCircle, label: 'Pending' },
  confirmed: { color: 'bg-primary/10 text-primary border-primary/20', icon: CheckCircle2, label: 'Confirmed' },
  cancelled: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle, label: 'Cancelled' },
  completed: { color: 'bg-muted/50 text-muted-foreground border-border', icon: CheckCircle2, label: 'Completed' },
  scheduled: { color: 'bg-primary/10 text-primary border-primary/20', icon: Calendar, label: 'Scheduled' },
  checked_in: { color: 'bg-accent text-accent-foreground border-accent-foreground/20', icon: CheckCircle2, label: 'Checked In' },
};

function AppointmentCard({ appointment, isPastAppointment }: { appointment: Appointment; isPastAppointment?: boolean }) {
  const config = statusConfig[appointment.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <Card className={`hover:shadow-sm transition-all ${isPastAppointment ? 'opacity-70' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isPastAppointment ? 'bg-muted/50' : 'bg-primary/10'}`}>
              <Stethoscope className={`h-5 w-5 ${isPastAppointment ? 'text-muted-foreground' : 'text-primary'}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className="font-semibold text-sm">
                  Dr. {appointment.clinician_name || 'Doctor'}
                </h3>
                <Badge variant="outline" className={`text-[10px] px-2 py-0 h-5 ${config.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(appointment.scheduled_at), 'EEEE, MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(appointment.scheduled_at), 'h:mm a')}
                </span>
              </div>
              {appointment.reason && (
                <p className="mt-2 text-sm text-muted-foreground/80 line-clamp-1">{appointment.reason}</p>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            {appointment.status === 'confirmed' && !isPastAppointment && (
              <Link to={`/appointments/${appointment.id}/triage`}>
                <Button size="sm" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Start Triage
                </Button>
              </Link>
            )}
            {appointment.status === 'pending' && !isPastAppointment && (
              <Badge variant="outline" className="bg-warning/5 text-warning border-warning/20 text-xs">
                Awaiting confirmation
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function PatientAppointments() {
  const { patientId, setMockPatientId } = useUserStore();

  if (!patientId) setMockPatientId();

  const { data: appointments, isLoading } = usePatientAppointments(patientId || undefined);

  const now = new Date();

  const upcomingAppointments = (appointments || [])
    .filter(a => ['pending', 'confirmed', 'scheduled', 'checked_in'].includes(a.status))
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const pastAppointments = (appointments || [])
    .filter(a => ['completed', 'cancelled'].includes(a.status))
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/patient/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">Sehatly</span>
            </Link>
          </div>
          <Link to="/doctors/search">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Book New
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
          <h1 className="text-2xl font-bold mb-1">My Appointments</h1>
          <p className="text-sm text-muted-foreground mb-8">
            {upcomingAppointments.length} upcoming · {pastAppointments.length} past
          </p>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!appointments || appointments.length === 0) && (
          <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
            <Card>
              <CardContent className="py-16 text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-lg font-semibold mb-2">No appointments yet</h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Find a doctor and book your first appointment to get started with your healthcare journey.
                </p>
                <Link to="/doctors/search">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Book an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Appointments */}
        {!isLoading && upcomingAppointments.length > 0 && (
          <motion.section initial="hidden" animate="visible" custom={1} variants={fadeUp} className="mb-10">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming ({upcomingAppointments.length})
            </h2>
            <div className="space-y-3">
              {upcomingAppointments.map((appt, i) => (
                <motion.div key={appt.id} initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}>
                  <AppointmentCard appointment={appt} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Past Appointments */}
        {!isLoading && pastAppointments.length > 0 && (
          <motion.section initial="hidden" animate="visible" custom={2} variants={fadeUp}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Past ({pastAppointments.length})
            </h2>
            <div className="space-y-3">
              {pastAppointments.map((appt, i) => (
                <motion.div key={appt.id} initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}>
                  <AppointmentCard appointment={appt} isPastAppointment />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
