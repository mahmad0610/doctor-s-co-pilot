import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Calendar,
  Stethoscope,
  Clock,
  FileText,
  Plus,
  Star,
  Filter,
  ChevronRight,
  PanelLeft,
} from 'lucide-react';
import { ClinicianCard } from '@/components/ClinicianCard';
import { BookingModal } from '@/components/BookingModal';
import { PatientChatInline } from '@/components/PatientChatInline';
import { PatientSidebar } from '@/components/PatientSidebar';
import { useSearchClinicians } from '@/hooks/api/useClinicians';
import { usePatientAppointments } from '@/hooks/api/useAppointments';
import { useUserStore } from '@/stores/userStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import type { Clinician, ClinicianSearchParams } from '@/types';

const SPECIALTIES = [
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'General Physician',
];

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-primary/10 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
  completed: 'bg-muted/50 text-muted-foreground',
  scheduled: 'bg-primary/10 text-primary',
  checked_in: 'bg-accent text-accent-foreground',
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { patientId, setMockPatientId } = useUserStore();

  if (!patientId) setMockPatientId();

  const [activeView, setActiveView] = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useState<ClinicianSearchParams>({});
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: clinicians, isLoading: cliniciansLoading } = useSearchClinicians(searchParams);
  const { data: appointments, isLoading: appointmentsLoading } = usePatientAppointments(patientId || undefined);

  const upcomingAppointments = appointments?.filter(a =>
    ['pending', 'confirmed', 'scheduled'].includes(a.status)
  ) || [];

  const handleSearch = () => {
    const params: ClinicianSearchParams = {};
    if (searchInput) {
      const matched = SPECIALTIES.find(s => s.toLowerCase().includes(searchInput.toLowerCase()));
      if (matched) params.specialty = matched;
      else params.city = searchInput;
    }
    setSearchParams(params);
  };

  const handleBook = (clinician: Clinician) => {
    setSelectedClinician(clinician);
    setBookingOpen(true);
  };

  const handleViewProfile = (clinician: Clinician) => {
    navigate(`/doctors/${clinician.id}`);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      {(!isMobile || !sidebarCollapsed) && (
        <PatientSidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            if (isMobile) setSidebarCollapsed(true);
          }}
          collapsed={sidebarCollapsed && !isMobile}
          onCollapsedChange={setSidebarCollapsed}
          appointmentCount={upcomingAppointments.length}
        />
      )}

      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        {isMobile && (
          <div className="flex items-center h-14 px-4 border-b bg-card">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mr-2"
              onClick={() => setSidebarCollapsed(false)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-sm">
              {activeView === 'chat' && 'AI Assistant'}
              {activeView === 'doctors' && 'Find Doctors'}
              {activeView === 'appointments' && 'Appointments'}
            </span>
          </div>
        )}

        {/* View content */}
        {activeView === 'chat' && (
          <PatientChatInline onNavigate={setActiveView} />
        )}

        {activeView === 'doctors' && (
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {/* Search bar */}
              <div>
                <h2 className="text-2xl font-bold mb-1">Find a Doctor</h2>
                <p className="text-sm text-muted-foreground mb-4">Search by specialty, city, or condition</p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Cardiologist, Lahore..."
                      className="pl-10"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} className="gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Specialties:
                </span>
                {SPECIALTIES.map(s => (
                  <Badge
                    key={s}
                    variant={searchParams.specialty === s ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setSearchParams(p => ({
                        ...p,
                        specialty: p.specialty === s ? undefined : s,
                      }));
                    }}
                  >
                    {s}
                  </Badge>
                ))}
              </div>

              {/* Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {clinicians?.length ?? 0} Doctors Found
                </h3>
                {cliniciansLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-40 w-full rounded-xl" />
                    ))}
                  </div>
                ) : clinicians && clinicians.length > 0 ? (
                  <div className="space-y-4">
                    {clinicians.map(c => (
                      <ClinicianCard
                        key={c.id}
                        clinician={c}
                        onBook={handleBook}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="font-medium mb-1">No doctors found</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'appointments' && (
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">My Appointments</h2>
                  <p className="text-sm text-muted-foreground">{upcomingAppointments.length} upcoming</p>
                </div>
                <Button onClick={() => setActiveView('doctors')} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Book New
                </Button>
              </div>

              {appointmentsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map(appt => (
                    <Card key={appt.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Stethoscope className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">Dr. {appt.clinician_name || 'Doctor'}</h3>
                                <Badge className={statusColors[appt.status]}>{appt.status}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(appt.scheduled_at), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {format(new Date(appt.scheduled_at), 'h:mm a')}
                                </span>
                              </div>
                              {appt.reason && (
                                <p className="mt-2 text-sm text-muted-foreground">{appt.reason}</p>
                              )}
                            </div>
                          </div>
                          {appt.status === 'confirmed' && (
                            <Link to={`/appointments/${appt.id}/triage`}>
                              <Button className="gap-2" size="sm">
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
                  <CardContent className="py-16 text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="font-medium mb-1">No appointments yet</p>
                    <p className="text-sm mb-4">Book your first appointment with a doctor</p>
                    <Button onClick={() => setActiveView('doctors')} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Find a Doctor
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        clinician={selectedClinician}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
