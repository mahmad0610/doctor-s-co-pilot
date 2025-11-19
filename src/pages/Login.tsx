import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';

export default function Login() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/patients');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-10 h-10 text-primary-foreground"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Sehatly</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Doctor Dashboard</p>
          </div>
          <CardDescription className="text-base">
            Your AI-powered clinical command center
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            size="lg"
            className="w-full gap-2"
          >
            <Chrome className="h-5 w-5" />
            Sign in with Google
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Doctor role required for access
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
