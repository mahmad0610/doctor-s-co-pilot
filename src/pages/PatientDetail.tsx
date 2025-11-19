import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Heart, 
  Activity, 
  Thermometer,
  Wind,
  Calendar,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  User as UserIcon
} from 'lucide-react';
import { mockPatients, mockTriageBriefs, mockCarePlans, mockVitalsTimeline } from '@/lib/mockData';
import { PatientDetailSkeleton } from '@/components/LoadingSkeleton';
import { AILabel } from '@/components/AILabel';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading] = useState(false);

  const patient = mockPatients.find(p => p.id === id);
  const triage = id ? mockTriageBriefs[id] : undefined;
  const carePlan = id ? mockCarePlans[id] : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <PatientDetailSkeleton />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Patient not found</h2>
          <Button onClick={() => navigate('/patients')}>Back to list</Button>
        </div>
      </div>
    );
  }

  const vitalsChartData = mockVitalsTimeline.map(v => ({
    date: format(v.date, 'MMM d'),
    hr: v.heartRate,
    o2: v.oxygenLevel,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{patient.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {patient.age} years • {patient.gender}
                </p>
              </div>
            </div>
            <Button onClick={() => navigate(`/patients/${id}/care-plan`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Care Plan
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Vitals Cards - Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.vitals.heartRate}</div>
              <p className="text-xs text-muted-foreground">bpm</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.vitals.bloodPressure}</div>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-warning" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.vitals.temperature}°F</div>
              <p className="text-xs text-muted-foreground">Normal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                Oxygen Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.vitals.oxygenLevel}%</div>
              <p className="text-xs text-muted-foreground">SpO₂</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Triage Brief */}
        {triage && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    AI Triage Brief
                  </CardTitle>
                  <CardDescription>
                    Generated {format(triage.generatedAt, 'PPp')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <AILabel />
                  <ConfidenceBadge confidence={triage.confidence} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground">{triage.summary}</p>
              </div>

              {triage.flags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Flags</h4>
                  <div className="space-y-2">
                    {triage.flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-3 rounded-lg ${
                          flag.severity === 'high'
                            ? 'bg-destructive/10 border border-destructive/20'
                            : 'bg-warning/10 border border-warning/20'
                        }`}
                      >
                        <AlertTriangle
                          className={`h-4 w-4 mt-0.5 ${
                            flag.severity === 'high' ? 'text-destructive' : 'text-warning'
                          }`}
                        />
                        <span className="text-sm">{flag.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {triage.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for detailed views */}
        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vitals">Vitals Timeline</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Vitals Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vitalsChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hr" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      name="Heart Rate"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="o2" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Oxygen %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {patient.medications.map((med, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{med}</span>
                      <Badge variant="outline">Active</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions">
            <Card>
              <CardHeader>
                <CardTitle>Chronic Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {patient.conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="w-0.5 h-full bg-border mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold">Last Visit</p>
                      <p className="text-sm text-muted-foreground">
                        {format(patient.lastVisit, 'PPP')}
                      </p>
                      <p className="text-sm mt-1">Routine check-up completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
