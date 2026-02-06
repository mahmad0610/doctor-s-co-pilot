import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Heart,
  Search,
  Calendar,
  MessageSquare,
  Stethoscope,
  Clock,
  FileText,
  Bot,
  Plus,
  ArrowRight,
  Star,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { ClinicianCard } from '@/components/ClinicianCard';
import { BookingModal } from '@/components/BookingModal';
import { PatientChatWidget } from '@/components/PatientChatWidget';
import { useSearchClinicians } from '@/hooks/api/useClinicians';
import { usePatientAppointments } from '@/hooks/api/useAppointments';
import { useUserStore } from '@/stores/userStore';
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
  completed: 'bg-muted text-muted-foreground',
  scheduled: 'bg-primary/10 text-primary',
  checked_in: 'bg-accent text-accent-foreground',
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { patientId, setMockPatientId } = useUserStore();

  // Auto-set mock patient for MVP
  if (!patientId) setMockPatientId();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useState<ClinicianSearchParams>({});
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const { data: clinicians, isLoading: cliniciansLoading } = useSearchClinicians(searchParams);
  const { data: appointments, isLoading: appointmentsLoading } = usePatientAppointments(patientId || undefined);

  const upcomingAppointments = appointments?.filter(a =>
    ['pending', 'confirmed', 'scheduled'].includes(a.status)
  ) || [];

  const handleSearch = () => {
    const params: ClinicianSearchParams = {};
    if (searchInput) {
      const matched = SPECIALTIES.find(s => s.toLowerCase().includes(searchInput.toLowerCase()));
      if (matched) {
        params.specialty = matched;
      } else {
        params.city = searchInput;
      }
    }
    setSearchParams(params);
    setActiveTab('doctors');
  };

  const handleBook = (clinician: Clinician) => {
    setSelectedClinician(clinician);
    setBookingOpen(true);
  };

  const handleViewProfile = (clinician: Clinician) => {
    navigate(`/doctors/${clinician.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Sehatly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setChatOpen(true)}
            >
              <Bot className="h-4 w-4" />
              AI Assistant
            </Button>
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome + Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Sehatly</h1>
          <p className="text-muted-foreground mb-6">Find a doctor, manage appointments, or chat with our AI health assistant.</p>

          <div className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by specialty or city..."
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group"
            onClick={() => setActiveTab('doctors')}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">Find Doctors</div>
                <div className="text-xs text-muted-foreground">Browse & book</div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group"
            onClick={() => setChatOpen(true)}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">AI Assistant</div>
                <div className="text-xs text-muted-foreground">Chat for help</div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group"
            onClick={() => setActiveTab('appointments')}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">Appointments</div>
                <div className="text-xs text-muted-foreground">{upcomingAppointments.length} upcoming</div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group"
            onClick={() => navigate('/doctors/search')}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">Book New</div>
                <div className="text-xs text-muted-foreground">Full search</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="doctors" className="gap-1.5">
              <Stethoscope className="h-3.5 w-3.5" />
              Doctors
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Appointments
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Upcoming Appointments Preview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('appointments')} className="gap-1">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map(appt => (
                      <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Dr. {appt.clinician_name || 'Doctor'}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(new Date(appt.scheduled_at), 'MMM d, h:mm a')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[appt.status]}>{appt.status}</Badge>
                          {appt.status === 'confirmed' && (
                            <Link to={`/appointments/${appt.id}/triage`}>
                              <Button size="sm" variant="outline" className="gap-1 text-xs">
                                <FileText className="h-3 w-3" />
                                Triage
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm mb-3">No upcoming appointments</p>
                    <Button size="sm" onClick={() => setActiveTab('doctors')} className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Book an Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Specialties */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Popular Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIALTIES.map(s => (
                    <Button
                      key={s}
                      variant="outline"
                      className="justify-start gap-2 h-auto py-3"
                      onClick={() => {
                        setSearchParams({ specialty: s });
                        setSearchInput(s);
                        setActiveTab('doctors');
                      }}
                    >
                      <Stethoscope className="h-4 w-4 text-primary" />
                      {s}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant CTA */}
            <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Need help finding a doctor?</h3>
                    <p className="text-sm opacity-90">Chat with our AI Health Assistant</p>
                  </div>
                </div>
                <Button variant="secondary" onClick={() => setChatOpen(true)} className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Quick filters:
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

            {/* Doctor Results */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {clinicians?.length ?? 0} Doctors Found
              </h2>

              {cliniciansLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full" />
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
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="mb-1">No doctors found</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">My Appointments</h2>
              <Button size="sm" onClick={() => setActiveTab('doctors')} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Book New
              </Button>
            </div>

            {appointmentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : appointments && appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map(appt => (
                  <Card key={appt.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
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
                        {appt.status === 'confirmed' && (
                          <Link to={`/appointments/${appt.id}/triage`}>
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
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-40" />
                  <p className="mb-4">No appointments yet</p>
                  <Button onClick={() => setActiveTab('doctors')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Modal */}
      <BookingModal
        clinician={selectedClinician}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />

      {/* Chat Widget */}
      <PatientChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
