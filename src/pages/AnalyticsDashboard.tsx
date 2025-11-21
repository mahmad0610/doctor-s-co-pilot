import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockVitalsTimeline } from '@/lib/mockData';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const kpiData = [
  { label: 'Active Patients', value: '24', change: '+12%', icon: Users, color: 'text-primary' },
  { label: 'Appointments Today', value: '8', change: '+2', icon: Calendar, color: 'text-emerald-600' },
  { label: 'Avg. Adherence', value: '87%', change: '+5%', icon: Activity, color: 'text-amber-600' },
  { label: 'Plans Signed', value: '15', change: '+8', icon: TrendingUp, color: 'text-blue-600' },
];

const adherenceData = [
  { day: 'Mon', rate: 85 },
  { day: 'Tue', rate: 88 },
  { day: 'Wed', rate: 82 },
  { day: 'Thu', rate: 90 },
  { day: 'Fri', rate: 87 },
  { day: 'Sat', rate: 84 },
  { day: 'Sun', rate: 89 },
];

const diagnosticSummaries = [
  { condition: 'Type 2 Diabetes', count: 8, severity: 'high' },
  { condition: 'Hypertension', count: 12, severity: 'medium' },
  { condition: 'Asthma', count: 4, severity: 'low' },
  { condition: 'Anxiety', count: 6, severity: 'medium' },
];

export default function AnalyticsDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/patients')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Practice insights and patient trends</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-600">{kpi.change}</span> from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vitals Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockVitalsTimeline}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                    className="text-muted-foreground"
                  />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Heart Rate"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="oxygenLevel" 
                    stroke="hsl(var(--emerald-500))" 
                    strokeWidth={2}
                    name="O2 Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medication Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {diagnosticSummaries.map((item) => (
                <div key={item.condition} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{item.condition}</div>
                      <div className="text-sm text-muted-foreground">{item.count} patients</div>
                    </div>
                  </div>
                  <Badge variant={
                    item.severity === 'high' ? 'destructive' : 
                    item.severity === 'medium' ? 'default' : 'outline'
                  }>
                    {item.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
