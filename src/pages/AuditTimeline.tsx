import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, User, Bot, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: Date;
  actor: 'doctor' | 'ai' | 'system';
  actorName: string;
  action: string;
  details: string;
  patientId?: string;
  patientName?: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(),
    actor: 'doctor',
    actorName: 'Dr. Smith',
    action: 'Signed Care Plan',
    details: 'Approved 7-day care plan with medication adjustments',
    patientId: '1',
    patientName: 'Sarah Johnson'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000),
    actor: 'ai',
    actorName: 'AI Engine',
    action: 'Generated Triage Brief',
    details: 'Confidence: 75% - Identified elevated BP readings',
    patientId: '1',
    patientName: 'Sarah Johnson'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000),
    actor: 'doctor',
    actorName: 'Dr. Smith',
    action: 'Override Alert',
    details: 'Dismissed drug interaction warning - patient tolerance confirmed',
    patientId: '1',
    patientName: 'Sarah Johnson'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 10800000),
    actor: 'ai',
    actorName: 'AI Engine',
    action: 'Generated Care Plan',
    details: 'Created initial care plan draft with 12 activities',
    patientId: '2',
    patientName: 'Michael Chen'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 14400000),
    actor: 'system',
    actorName: 'System',
    action: 'Data Sync',
    details: 'Synced patient vitals from mobile app',
    patientId: '1',
    patientName: 'Sarah Johnson'
  },
];

export default function AuditTimeline() {
  const navigate = useNavigate();
  const [filterActor, setFilterActor] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    if (filterActor !== 'all' && log.actor !== filterActor) return false;
    if (filterAction !== 'all' && !log.action.toLowerCase().includes(filterAction)) return false;
    return true;
  });

  const getActorIcon = (actor: AuditLog['actor']) => {
    switch (actor) {
      case 'doctor':
        return <User className="h-5 w-5 text-primary" />;
      case 'ai':
        return <Bot className="h-5 w-5 text-amber-600" />;
      case 'system':
        return <Shield className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/patients')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
          <h1 className="text-3xl font-bold">Audit & Timeline View</h1>
          <p className="text-muted-foreground">Complete log of all actions and AI outputs</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Select value={filterActor} onValueChange={setFilterActor}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="ai">AI Engine</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="override">Override</SelectItem>
                <SelectItem value="sync">Sync</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredLogs.map((log, idx) => (
            <Card key={log.id} className="relative">
              {idx !== filteredLogs.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-border" />
              )}
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 z-10">
                    <div className="w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center">
                      {getActorIcon(log.actor)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{log.actorName}</span>
                          <Badge variant="outline" className="capitalize">{log.actor}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(log.timestamp, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      {log.patientName && (
                        <Badge variant="secondary">
                          <FileText className="mr-1 h-3 w-3" />
                          {log.patientName}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="font-medium text-primary">{log.action}</div>
                      <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
