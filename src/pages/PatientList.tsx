import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Heart, 
  Activity, 
  Phone,
  Archive,
  User as UserIcon,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockPatients } from '@/lib/mockData';
import { PatientListSkeleton } from '@/components/LoadingSkeleton';
import { usePendingAppointments, useUpdateAppointmentStatus } from '@/hooks/api/useAppointments';
import { useUserStore } from '@/stores/userStore';
import { AppointmentStatus } from '@/types';
import { format } from 'date-fns';

type FilterStatus = 'all' | 'urgent' | 'today' | 'stable' | 'archived';

export default function PatientList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const navigate = useNavigate();
  
  const { clinicianId, setMockClinicianId } = useUserStore();
  
  // Auto-set mock clinician ID for development
  if (!clinicianId) {
    setMockClinicianId();
  }
  
  // Fetch pending appointments from API
  const { data: pendingAppointments, isLoading } = usePendingAppointments(clinicianId || undefined);
  const updateStatus = useUpdateAppointmentStatus();

  // Use mock patients for now (API integration for patient list would come from triage endpoint)
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    urgent: 'bg-destructive text-destructive-foreground animate-pulse-subtle',
    today: 'bg-amber-500 text-white',
    stable: 'bg-primary text-primary-foreground',
    archived: 'bg-muted text-muted-foreground',
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-primary/10 text-primary',
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    updateStatus.mutate({ id: appointmentId, status: 'confirmed' });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    updateStatus.mutate({ id: appointmentId, status: 'cancelled' });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PatientListSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Pending Appointments Section */}
      {pendingAppointments && pendingAppointments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            Pending Appointment Requests ({pendingAppointments.length})
          </h2>
          <div className="space-y-3">
            {pendingAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{appointment.patient_name || 'Patient'}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(appointment.scheduled_at), 'MMM d, yyyy • h:mm a')}
                      </div>
                      <div className="text-sm">{appointment.reason}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleConfirmAppointment(appointment.id)}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['all', 'urgent', 'today', 'stable', 'archived'] as FilterStatus[]).map((status) => (
            <Badge
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <h2 className="text-lg font-semibold mb-4">Your Patients</h2>
      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/patients/${patient.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-7 w-7 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{patient.name}</h3>
                    {patient.unreadMessages > 0 && (
                      <Badge variant="destructive" className="h-5 px-2">
                        {patient.unreadMessages}
                      </Badge>
                    )}
                    <Badge className={statusColors[patient.status]}>
                      {patient.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {patient.age} years • {patient.gender} • Last visit: {format(patient.lastVisit, 'MMM d')}
                  </p>

                  {/* Vitals Preview */}
                  <div className="flex gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-destructive" />
                      <span>{patient.vitals.heartRate} bpm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-primary" />
                      <span>{patient.vitals.bloodPressure}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>O₂</span>
                      <span>{patient.vitals.oxygenLevel}%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle call
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle archive
                    }}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No patients found</p>
        </div>
      )}
    </div>
  );
}
