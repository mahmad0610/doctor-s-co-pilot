import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Heart, Star } from 'lucide-react';
import { ClinicianCard } from '@/components/ClinicianCard';
import { BookingModal } from '@/components/BookingModal';
import { useSearchClinicians } from '@/hooks/api/useClinicians';
import { useUserStore } from '@/stores/userStore';
import type { Clinician, ClinicianSearchParams } from '@/types';
import { Link } from 'react-router-dom';

const SPECIALTIES = [
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'General Physician',
];

export default function DoctorSearch() {
  const navigate = useNavigate();
  const { patientId, setMockPatientId } = useUserStore();
  
  const [searchParams, setSearchParams] = useState<ClinicianSearchParams>({});
  const [searchInput, setSearchInput] = useState('');
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: clinicians, isLoading } = useSearchClinicians(searchParams);

  const handleSearch = () => {
    const params: ClinicianSearchParams = {};
    if (searchInput) {
      // Check if search matches a specialty
      const matchedSpecialty = SPECIALTIES.find(s => 
        s.toLowerCase().includes(searchInput.toLowerCase())
      );
      if (matchedSpecialty) {
        params.specialty = matchedSpecialty;
      } else {
        params.city = searchInput;
      }
    }
    setSearchParams(params);
  };

  const handleSpecialtyClick = (specialty: string) => {
    setSearchParams({ specialty });
    setSearchInput(specialty);
  };

  const handleFilterAcceptingNew = () => {
    setSearchParams(prev => ({ ...prev, accepting_new: true }));
  };

  const handleFilterTopRated = () => {
    setSearchParams(prev => ({ ...prev, min_rating: 4.5 }));
  };

  const handleBook = (clinician: Clinician) => {
    if (!patientId) {
      // For MVP, set mock patient ID
      setMockPatientId();
    }
    setSelectedClinician(clinician);
    setBookingOpen(true);
  };

  const handleViewProfile = (clinician: Clinician) => {
    navigate(`/doctors/${clinician.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sehatly</span>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="flex gap-2 max-w-2xl mx-auto">
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
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter:
          </span>
          <Badge
            variant={searchParams.accepting_new ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={handleFilterAcceptingNew}
          >
            Accepting New Patients
          </Badge>
          <Badge
            variant={searchParams.min_rating ? 'default' : 'outline'}
            className="cursor-pointer gap-1"
            onClick={handleFilterTopRated}
          >
            <Star className="h-3 w-3" />
            Top Rated (4.5+)
          </Badge>
          {searchParams.specialty && (
            <Badge variant="secondary">
              {searchParams.specialty}
              <button 
                className="ml-1 hover:text-destructive"
                onClick={() => setSearchParams(prev => ({ ...prev, specialty: undefined }))}
              >
                ×
              </button>
            </Badge>
          )}
        </div>

        {/* Specialty Quick Links */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Popular Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map(specialty => (
              <Button
                key={specialty}
                variant="outline"
                size="sm"
                onClick={() => handleSpecialtyClick(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {clinicians?.length ?? 0} Doctors Found
          </h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : clinicians && clinicians.length > 0 ? (
            <div className="space-y-4">
              {clinicians.map(clinician => (
                <ClinicianCard
                  key={clinician.id}
                  clinician={clinician}
                  onBook={handleBook}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">No doctors found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>

      <BookingModal
        clinician={selectedClinician}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
