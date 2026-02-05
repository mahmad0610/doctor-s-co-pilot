import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope, Calendar, MessageSquare, Shield, Brain } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Sehatly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/doctors/search">
              <Button variant="ghost">Find Doctors</Button>
            </Link>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Your Health, <span className="text-primary">Reimagined</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Connect with top doctors, get AI-powered health insights, and manage your care journey seamlessly on one platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/doctors/search">
            <Button size="lg" className="gap-2">
              <Stethoscope className="h-5 w-5" />
              Find a Doctor
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="gap-2">
              I'm a Healthcare Provider
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Sehatly?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI-Powered Triage</CardTitle>
              <CardDescription>
                Get preliminary health assessments before your consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              Our intelligent system helps prioritize your concerns and prepares your doctor for a more focused consultation.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Easy Scheduling</CardTitle>
              <CardDescription>
                Book appointments with top doctors instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              View real-time availability and book consultations that fit your schedule, all in just a few clicks.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure Messaging</CardTitle>
              <CardDescription>
                Stay connected with your healthcare team
              </CardDescription>
            </CardHeader>
            <CardContent>
              Communicate securely with your doctors, share updates, and receive personalized guidance anytime.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Secure & HIPAA Compliant</span>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Your health data is protected with enterprise-grade security. We take your privacy seriously.
        </p>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of patients getting better healthcare
            </p>
            <Link to="/doctors/search">
              <Button size="lg" variant="secondary" className="gap-2">
                <Stethoscope className="h-5 w-5" />
                Find Your Doctor
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>© 2024 Sehatly. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-foreground">Privacy</Link>
            <Link to="#" className="hover:text-foreground">Terms</Link>
            <Link to="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
