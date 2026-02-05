import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, Star, MapPin, Clock, GraduationCap, 
  CheckCircle, Calendar, Heart 
} from 'lucide-react';
import { useClinician } from '@/hooks/api/useClinicians';
import { BookingModal } from '@/components/BookingModal';
import { useUserStore } from '@/stores/userStore';

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: clinician, isLoading } = useClinician(id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { patientId, setMockPatientId } = useUserStore();

  const handleBook = () => {
    if (!patientId) {
      setMockPatientId();
    }
    setBookingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </main>
      </div>
    );
  }

  if (!clinician) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Doctor not found</h2>
          <Link to="/doctors/search">
            <Button variant="outline">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/doctors/search">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sehatly</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                    {clinician.full_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">Dr. {clinician.full_name}</h1>
                      {clinician.accepting_new_patients && (
                        <Badge className="gap-1 bg-emerald-100 text-emerald-700">
                          <CheckCircle className="h-3 w-3" />
                          Accepting New Patients
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-4">{clinician.specialty}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{clinician.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{clinician.years_experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{clinician.address.city}, {clinician.address.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dr. {clinician.full_name} is an experienced {clinician.specialty.toLowerCase()} 
                  with {clinician.years_experience} years of practice. They are currently 
                  accepting new patients and offer consultations at their clinic in {clinician.address.city}.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    Rs. {clinician.consultation_fee}
                  </div>
                  <div className="text-sm text-muted-foreground">per consultation</div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>30 min average consultation</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleBook}>
                  Book Appointment
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You can cancel or reschedule for free up to 24 hours before the appointment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BookingModal
        clinician={clinician}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
