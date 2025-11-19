import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Calendar,
  Save,
  Eye,
  CheckCircle
} from 'lucide-react';
import { mockPatients, mockCarePlans } from '@/lib/mockData';
import { AILabel } from '@/components/AILabel';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';

export default function CarePlanEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSignModal, setShowSignModal] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [signing, setSigning] = useState(false);

  const patient = mockPatients.find(p => p.id === id);
  const carePlan = id ? mockCarePlans[id] : undefined;

  if (!patient || !carePlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Care plan not found</h2>
          <Button onClick={() => navigate('/patients')}>Back to list</Button>
        </div>
      </div>
    );
  }

  const hasDrugInteractions = carePlan.drugInteractions.length > 0;
  const hasSevereInteractions = carePlan.drugInteractions.some(
    (d) => d.severity === 'severe'
  );

  const handleSign = async () => {
    if (!reviewed) {
      toast.error('Please confirm that you have reviewed the care plan');
      return;
    }

    if (hasSevereInteractions) {
      toast.error('Cannot sign: Severe drug interactions detected');
      return;
    }

    setSigning(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Confetti animation on success
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    toast.success('Care plan signed successfully!');
    setSigning(false);
    setShowSignModal(false);

    // Navigate back after a delay
    setTimeout(() => {
      navigate(`/patients/${id}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/patients/${id}`)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Care Plan Editor</h1>
                <p className="text-sm text-muted-foreground">{patient.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/patients/${id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={() => setShowSignModal(true)}
                disabled={hasSevereInteractions}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Sign & Approve
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Confidence Warning */}
        {carePlan.confidence < 60 && (
          <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg text-destructive mb-1">
                  LOW CONFIDENCE WARNING
                </h3>
                <p className="text-sm">
                  This care plan has a confidence score below 60%. Please review carefully before
                  signing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Drug Interactions */}
        {hasDrugInteractions && (
          <Card className="mb-6 border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Drug Interactions Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {carePlan.drugInteractions.map((interaction, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      interaction.severity === 'severe'
                        ? 'bg-destructive/10 border-destructive'
                        : 'bg-warning/10 border-warning'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={interaction.severity === 'severe' ? 'destructive' : 'default'}
                      >
                        {interaction.severity.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{interaction.drugs.join(' + ')}</span>
                    </div>
                    <p className="text-sm mb-2">{interaction.description}</p>
                    <p className="text-sm font-medium">
                      Recommendation: {interaction.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Plan Details</CardTitle>
              <ConfidenceBadge confidence={carePlan.confidence} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <AILabel />
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Created:</span>{' '}
                {format(carePlan.createdAt, 'PPp')}
              </p>
              <p>
                <span className="text-muted-foreground">Last Modified:</span>{' '}
                {format(carePlan.lastModified, 'PPp')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Daily Timeline</h2>
          {carePlan.timeline.map((day) => (
            <Card key={day.day}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Day {day.day} - {format(day.date, 'MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {day.activities.map((activity) => (
                  <div key={activity.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge>{activity.type}</Badge>
                      {activity.time && (
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      )}
                    </div>
                    <Input
                      defaultValue={activity.title}
                      className="font-semibold"
                      placeholder="Activity title"
                    />
                    <Textarea
                      defaultValue={activity.description}
                      placeholder="Activity description"
                      rows={2}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-6 p-3 bg-muted rounded-lg text-center text-sm text-muted-foreground">
          <kbd className="px-2 py-1 bg-background rounded border">Cmd</kbd> +{' '}
          <kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> to sign
        </div>
      </div>

      {/* Sign & Override Modal */}
      <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {hasSevereInteractions ? 'Cannot Sign' : 'Review & Sign'}
            </DialogTitle>
            <DialogDescription>
              {hasSevereInteractions
                ? 'This care plan cannot be signed due to severe drug interactions.'
                : 'Please confirm that you have reviewed and approve this care plan.'}
            </DialogDescription>
          </DialogHeader>

          {hasSevereInteractions ? (
            <div className="p-4 bg-destructive/10 border-2 border-destructive rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-destructive mb-2">SEVERE DRUG INTERACTIONS</h4>
                  <p className="text-sm">
                    Please resolve all severe drug interactions before signing this care plan.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="reviewed"
                  checked={reviewed}
                  onCheckedChange={(checked) => setReviewed(checked as boolean)}
                />
                <label htmlFor="reviewed" className="text-sm cursor-pointer">
                  I have reviewed this care plan and approve all recommendations. I understand that
                  this will become the active treatment plan for {patient.name}.
                </label>
              </div>

              {carePlan.confidence < 80 && (
                <div className="p-3 bg-warning/10 border border-warning rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> This plan has a {carePlan.confidence}% confidence
                    score. Please ensure all details are accurate.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {hasSevereInteractions ? (
              <Button variant="outline" onClick={() => setShowSignModal(false)}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowSignModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSign} disabled={!reviewed || signing}>
                  {signing ? (
                    'Signing...'
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sign & Approve
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
