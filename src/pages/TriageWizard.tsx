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
import { ArrowLeft, ArrowRight, Heart, CheckCircle, Loader2 } from 'lucide-react';
import { 
  useAppointment, 
} from '@/hooks/api/useAppointments';
import { 
  useTriageQuestions, 
  useStartTriageSession, 
  useSubmitTriageAnswers 
} from '@/hooks/api/useTriage';
import confetti from 'canvas-confetti';

export default function TriageWizard() {
  const { id: appointmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const { data: appointment, isLoading: appointmentLoading } = useAppointment(appointmentId);
  const startSession = useStartTriageSession();
  const { data: questions, isLoading: questionsLoading } = useTriageQuestions(sessionId || undefined);
  const submitAnswers = useSubmitTriageAnswers();

  // Start session on mount
  useEffect(() => {
    if (appointmentId && !sessionId && !startSession.isPending) {
      startSession.mutate(
        { appointmentId, chiefComplaint: appointment?.reason },
        {
          onSuccess: (session) => {
            setSessionId(session.id);
          },
        }
      );
    }
  }, [appointmentId, sessionId, appointment]);

  const totalSteps = questions?.length || 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = questions?.[currentStep];

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

  const handleSubmit = async () => {
    if (!sessionId) return;
    
    try {
      await submitAnswers.mutateAsync({ sessionId, answers });
      setCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  if (appointmentLoading || startSession.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sehatly</span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sehatly</span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Triage Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Your responses have been submitted. Your doctor will review this information before your appointment.
              </p>
              <Button onClick={() => navigate('/my-appointments')}>
                Back to My Appointments
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sehatly</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Pre-Consultation Triage</span>
            <span>Step {currentStep + 1} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {questionsLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : currentQuestion ? (
          <Card>
            <CardHeader>
              <CardTitle>{currentQuestion.text}</CardTitle>
              <CardDescription>
                Please answer to the best of your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === 'text' && (
                <Textarea
                  placeholder="Type your answer..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  rows={4}
                />
              )}
              
              {currentQuestion.type === 'number' && (
                <Input
                  type="number"
                  placeholder="Enter a number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              )}
              
              {currentQuestion.type === 'choice' && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={handleAnswer}
                >
                  {['Yes', 'No', 'Not sure'].map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No questions available. Please contact support.
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === totalSteps - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitAnswers.isPending}
            >
              {submitAnswers.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
