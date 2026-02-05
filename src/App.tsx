import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DoctorSearch from "./pages/DoctorSearch";
import DoctorProfile from "./pages/DoctorProfile";

// Patient pages
import PatientAppointments from "./pages/PatientAppointments";
import TriageWizard from "./pages/TriageWizard";

// Clinician pages
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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Landing />} />
            
            {/* Patient-facing routes */}
            <Route path="/doctors/search" element={<DoctorSearch />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/my-appointments" element={<PatientAppointments />} />
            <Route path="/appointments/:id/triage" element={<TriageWizard />} />
            
            {/* Clinician dashboard routes */}
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PatientList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PatientDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id/care-plan"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CarePlanEditor />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scheduling"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SchedulingHub />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AnalyticsDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MessagingCenter />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AIAlertTriage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AuditTimeline />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
