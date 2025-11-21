import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Edit3, XCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockRecommendations } from '@/lib/mockData';
import { toast } from 'sonner';
import { AILabel } from '@/components/AILabel';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import confetti from 'canvas-confetti';

export default function AIAlertTriage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(mockRecommendations);

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
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`transition-all ${
                alert.status === 'approved' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' :
                alert.status === 'dismissed' ? 'opacity-50' : 
                'animate-pulse-slow'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <Badge variant="outline" className="capitalize">{alert.type}</Badge>
                        <ConfidenceBadge confidence={alert.confidence} />
                      </div>
                      <AILabel />
                    </div>
                  </div>
                  <Badge variant={
                    alert.status === 'approved' ? 'default' :
                    alert.status === 'dismissed' ? 'secondary' :
                    'outline'
                  } className="capitalize">
                    {alert.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{alert.description}</p>
                
                {alert.evidence.length > 0 && (
                  <div className="mb-4 p-3 bg-accent/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Evidence:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {alert.evidence.map((ev, idx) => (
                        <li key={idx} className="text-muted-foreground">{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {alert.status === 'pending' && (
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
                )}
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}
