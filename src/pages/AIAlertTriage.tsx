import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Edit3, XCircle, AlertTriangle, Flag, Loader2 } from 'lucide-react';
import { mockRecommendations } from '@/lib/mockData';
import { toast } from 'sonner';
import { AILabel } from '@/components/AILabel';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { useUserStore } from '@/stores/userStore';
import confetti from 'canvas-confetti';

export default function AIAlertTriage() {
  const [alerts, setAlerts] = useState(mockRecommendations);
  const { clinicianId, setMockClinicianId } = useUserStore();
  
  // Auto-set mock clinician ID
  if (!clinicianId) {
    setMockClinicianId();
  }

  const handleApprove = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    toast.success('Alert approved');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'dismissed' } : a));
    toast.info('Alert dismissed');
  };

  const handleEdit = (id: string) => {
    toast.info('Edit functionality coming soon');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'diagnosis':
        return <Flag className="h-5 w-5 text-primary" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-emerald-500';
    if (confidence >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const processedAlerts = alerts.filter(a => a.status !== 'pending');

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingAlerts.length}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.status === 'approved').length}
                </div>
                <div className="text-sm text-muted-foreground">Approved Today</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {alerts.reduce((sum, a) => sum + a.confidence, 0) / alerts.length}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <AILabel />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Alerts */}
      <h2 className="text-lg font-semibold mb-4">Pending Review</h2>
      <div className="grid gap-4 mb-8">
        {pendingAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            className="transition-all animate-pulse-slow border-l-4"
            style={{ borderLeftColor: `hsl(var(--${alert.confidence >= 80 ? 'primary' : alert.confidence >= 60 ? 'warning' : 'destructive'}))` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <Badge variant="outline" className="capitalize">{alert.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <AILabel />
                      {/* Confidence Meter */}
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${getConfidenceColor(alert.confidence)} transition-all`}
                            style={{ width: `${alert.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{alert.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{alert.description}</p>
              
              {alert.evidence.length > 0 && (
                <div className="mb-4 p-3 bg-accent/50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Supporting Evidence:</div>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {alert.evidence.map((ev, idx) => (
                      <li key={idx} className="text-muted-foreground">{ev}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleApprove(alert.id)}
                  className="flex-1"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleEdit(alert.id)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDismiss(alert.id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {pendingAlerts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>All alerts have been reviewed!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Processed Alerts */}
      {processedAlerts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Recently Processed</h2>
          <div className="grid gap-4">
            {processedAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`transition-all ${
                  alert.status === 'approved' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' :
                  'opacity-50'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <ConfidenceBadge confidence={alert.confidence} />
                      </div>
                    </div>
                    <Badge variant={
                      alert.status === 'approved' ? 'default' : 'secondary'
                    } className="capitalize">
                      {alert.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
