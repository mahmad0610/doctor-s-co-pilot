import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DoctorSearch from "./pages/DoctorSearch";
import DoctorProfile from "./pages/DoctorProfile";

// Patient pages
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointments from "./pages/PatientAppointments";
import TriageWizard from "./pages/TriageWizard";

// Clinician pages (no auth required)
import PatientList from "./pages/PatientList";
import PatientDetail from "./pages/PatientDetail";
import CarePlanEditor from "./pages/CarePlanEditor";
import SchedulingHub from "./pages/SchedulingHub";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MessagingCenter from "./pages/MessagingCenter";
import AIAlertTriage from "./pages/AIAlertTriage";
import AuditTimeline from "./pages/AuditTimeline";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Patient-facing routes */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/doctors/search" element={<DoctorSearch />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/my-appointments" element={<PatientAppointments />} />
            <Route path="/appointments/:id/triage" element={<TriageWizard />} />

            {/* Clinician dashboard routes (no auth) */}
            <Route path="/patients" element={<DashboardLayout><PatientList /></DashboardLayout>} />
            <Route path="/patients/:id" element={<DashboardLayout><PatientDetail /></DashboardLayout>} />
            <Route path="/patients/:id/care-plan" element={<DashboardLayout><CarePlanEditor /></DashboardLayout>} />
            <Route path="/scheduling" element={<DashboardLayout><SchedulingHub /></DashboardLayout>} />
            <Route path="/analytics" element={<DashboardLayout><AnalyticsDashboard /></DashboardLayout>} />
            <Route path="/messages" element={<DashboardLayout><MessagingCenter /></DashboardLayout>} />
            <Route path="/alerts" element={<DashboardLayout><AIAlertTriage /></DashboardLayout>} />
            <Route path="/audit" element={<DashboardLayout><AuditTimeline /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
