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
  User as UserIcon
} from 'lucide-react';
import { mockPatients } from '@/lib/mockData';
import { PatientListSkeleton } from '@/components/LoadingSkeleton';
import { PatientStatus } from '@/types';
import { format } from 'date-fns';

export default function PatientList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');
  const [loading] = useState(false);
  const navigate = useNavigate();

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    urgent: 'bg-destructive text-destructive-foreground animate-pulse-subtle',
    today: 'bg-warning text-warning-foreground',
    stable: 'bg-primary text-primary-foreground',
    archived: 'bg-muted text-muted-foreground',
  };

  if (loading) {
    return (
      <div className="p-6">
        <PatientListSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">

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
            <Badge
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Badge>
            <Badge
              variant={statusFilter === 'urgent' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('urgent')}
            >
              Urgent
            </Badge>
            <Badge
              variant={statusFilter === 'today' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('today')}
            >
              Today
            </Badge>
            <Badge
              variant={statusFilter === 'stable' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('stable')}
            >
              Stable
            </Badge>
          </div>
        </div>

        {/* Patient List */}
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
