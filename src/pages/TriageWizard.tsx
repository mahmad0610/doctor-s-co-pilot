import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  CheckCircle,
  Loader2,
  AlertCircle,
  FileText,
  RefreshCw,
} from 'lucide-react';
import {
  useAppointment,
} from '@/hooks/api/useAppointments';
import {
  useTriageQuestions,
  useStartTriageSession,
  useSubmitTriageAnswers,
} from '@/hooks/api/useTriage';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const cardVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/my-appointments">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Sehatly</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">{children}</main>
    </div>
  );
}

export default function TriageWizard() {
  const { id: appointmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [startError, setStartError] = useState(false);

  const { data: appointment, isLoading: appointmentLoading } = useAppointment(appointmentId);
  const startSession = useStartTriageSession();
  const { data: questions, isLoading: questionsLoading } = useTriageQuestions(sessionId || undefined);
  const submitAnswers = useSubmitTriageAnswers();

  // Start session on mount
  useEffect(() => {
    if (appointmentId && !sessionId && !startSession.isPending && !startError) {
      startSession.mutate(
        { appointmentId, chiefComplaint: appointment?.reason },
        {
          onSuccess: (session) => {
            setSessionId(session.id);
          },
          onError: () => {
            setStartError(true);
            toast.error('Failed to start triage session. Please try again.');
          },
        }
      );
    }
  }, [appointmentId, sessionId, appointment]);

  const totalSteps = questions?.length || 1;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const currentQuestion = questions?.[currentStep];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleAnswer = (value: string) => {
    if (currentQuestion) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRetryStart = () => {
    setStartError(false);
  };

  const handleSubmit = async () => {
    if (!sessionId) return;

    try {
      await submitAnswers.mutateAsync({ sessionId, answers });
      setCompleted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
      });
    } catch {
      toast.error('Failed to submit answers. Please try again.');
    }
  };

  // Loading state
  if (appointmentLoading || startSession.isPending) {
    return (
      <PageShell>
        <div className="space-y-4">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </PageShell>
    );
  }

  // Error starting session
  if (startError) {
    return (
      <PageShell>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Couldn't Start Triage</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              We couldn't start your triage session. This might be a temporary issue — please try again.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => navigate('/my-appointments')}>
                Back to Appointments
              </Button>
              <Button onClick={handleRetryStart} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  // Success state
  if (completed) {
    return (
      <PageShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Triage Complete!</h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Your responses have been submitted successfully. Your doctor will review this information before your appointment.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => navigate('/patient/dashboard')}>
                  Patient Dashboard
                </Button>
                <Button onClick={() => navigate('/my-appointments')}>
                  My Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-medium">Pre-Consultation Triage</span>
          </div>
          <span className="text-muted-foreground font-medium">
            {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      {questionsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : currentQuestion ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg leading-snug">{currentQuestion.text}</CardTitle>
                <CardDescription>
                  Please answer to the best of your knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.type === 'text' && (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={currentAnswer || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    rows={4}
                    className="resize-none text-base"
                  />
                )}

                {currentQuestion.type === 'number' && (
                  <Input
                    type="number"
                    placeholder="Enter a number"
                    value={currentAnswer || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="text-base"
                  />
                )}

                {currentQuestion.type === 'choice' && (
                  <RadioGroup
                    value={currentAnswer || ''}
                    onValueChange={handleAnswer}
                    className="space-y-2"
                  >
                    {['Yes', 'No', 'Not sure'].map(option => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          currentAnswer === option
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30 hover:bg-muted/30'
                        }`}
                      >
                        <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                        <Label htmlFor={`${currentQuestion.id}-${option}`} className="cursor-pointer font-medium">
                          {option}
                        </Label>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium mb-1">No questions available</p>
            <p className="text-sm">Please contact support if this issue persists.</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep === totalSteps - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitAnswers.isPending}
            className="gap-2 min-w-[120px]"
          >
            {submitAnswers.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit
                <CheckCircle className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </PageShell>
  );
}
