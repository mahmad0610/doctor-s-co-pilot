import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
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
import Index from "./pages/Index";

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
            <Route path="/" element={<Index />} />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <ProtectedRoute>
                  <PatientDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id/care-plan"
              element={
                <ProtectedRoute>
                  <CarePlanEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scheduling"
              element={
                <ProtectedRoute>
                  <SchedulingHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagingCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AIAlertTriage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <AuditTimeline />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
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
