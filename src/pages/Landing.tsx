import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Heart,
  Stethoscope,
  Calendar,
  MessageSquare,
  Shield,
  Brain,
  ArrowRight,
  Users,
  Activity,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stats = [
  { label: 'Active Doctors', value: '500+', icon: Stethoscope },
  { label: 'Patients Served', value: '50K+', icon: Users },
  { label: 'AI Accuracy', value: '96%', icon: Brain },
  { label: 'Avg Rating', value: '4.9', icon: Star },
];

const features = [
  {
    icon: Brain,
    title: 'AI Health Assistant',
    description: 'Chat with our AI to describe symptoms, get doctor recommendations, and book appointments — all in one conversation.',
    gradient: 'from-primary/20 to-accent',
  },
  {
    icon: Calendar,
    title: 'Instant Scheduling',
    description: 'View real-time doctor availability and book consultations that fit your schedule in just a few clicks.',
    gradient: 'from-accent to-primary/10',
  },
  {
    icon: MessageSquare,
    title: 'Pre-Consultation Triage',
    description: 'Complete smart questionnaires before your visit so your doctor is fully prepared from day one.',
    gradient: 'from-primary/10 to-accent',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade encryption protects your health data. HIPAA-compliant infrastructure you can trust.',
    gradient: 'from-accent to-primary/20',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Sehatly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/doctors/search">
              <Button variant="ghost" size="sm">Find Doctors</Button>
            </Link>
            <Link to="/patient/dashboard">
              <Button variant="ghost" size="sm">Patient Portal</Button>
            </Link>
            <Link to="/patients">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Clinician Dashboard
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent blur-3xl" />
        </div>

        <div className="container mx-auto px-4 pt-20 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8 border border-primary/10"
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Healthcare Platform
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Healthcare that{' '}
              <span className="text-primary">understands</span>{' '}
              you
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Find the right doctor, chat with our AI health assistant, and manage your entire care journey — all on one platform.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/patient/dashboard">
                <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20">
                  <MessageSquare className="h-5 w-5" />
                  Get Started as Patient
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/patients">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12">
                  <Stethoscope className="h-5 w-5" />
                  Clinician Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="text-center"
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for{' '}
            <span className="text-primary">better care</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From finding a doctor to completing your consultation — Sehatly streamlines every step.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
            >
              <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardContent className="p-8">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}>
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to better healthcare</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Describe Your Needs',
                description: 'Chat with our AI assistant or search manually. Tell us your symptoms, preferred specialty, or location.',
              },
              {
                step: '02',
                title: 'Book Your Doctor',
                description: 'Browse matched doctors, compare ratings and availability, then book your preferred slot instantly.',
              },
              {
                step: '03',
                title: 'Complete Pre-Visit Triage',
                description: 'Answer smart health questions so your doctor arrives fully prepared for your consultation.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-8 h-6 w-6 text-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <Card className="h-full bg-gradient-to-br from-primary to-primary-hover text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-8 relative">
                <Users className="h-10 w-10 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-3">For Patients</h3>
                <p className="opacity-90 mb-6 leading-relaxed">
                  Search doctors, chat with AI, book appointments, and manage your health journey seamlessly.
                </p>
                <Link to="/patient/dashboard">
                  <Button variant="secondary" className="gap-2">
                    Open Patient Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
          >
            <Card className="h-full border-2 border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-8">
                <Stethoscope className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">For Clinicians</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Manage patients, review AI-powered triage data, schedule appointments, and access analytics.
                </p>
                <Link to="/patients">
                  <Button variant="outline" className="gap-2">
                    Open Clinician Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Sehatly</span>
              <span className="text-muted-foreground text-sm">© 2024</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
