import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Clinician } from '@/types';

interface ClinicianCardProps {
  clinician: Clinician;
  onBook?: (clinician: Clinician) => void;
  onViewProfile?: (clinician: Clinician) => void;
}

export function ClinicianCard({ clinician, onBook, onViewProfile }: ClinicianCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {clinician.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Dr. {clinician.full_name}</h3>
              {clinician.accepting_new_patients && (
                <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-600">
                  <CheckCircle className="h-3 w-3" />
                  Accepting New
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{clinician.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium text-foreground">{clinician.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{clinician.years_experience} years exp.</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{clinician.address.city}, {clinician.address.state}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">Rs. {clinician.consultation_fee}</span>
            <span className="text-sm text-muted-foreground"> / consultation</span>
          </div>
          <div className="flex gap-2">
            {onViewProfile && (
              <Button variant="outline" onClick={() => onViewProfile(clinician)}>
                View Profile
              </Button>
            )}
            {onBook && (
              <Button onClick={() => onBook(clinician)}>
                Book Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
