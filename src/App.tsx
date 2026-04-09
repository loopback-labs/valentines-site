import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleAnalyticsRouteTracker } from "@/components/GoogleAnalyticsRouteTracker";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateSite from "./pages/CreateSite";
import EditSite from "./pages/EditSite";
import Responses from "./pages/Responses";
import ValentineSite from "./pages/ValentineSite";
import NotFound from "./pages/NotFound";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GoogleAnalyticsRouteTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateSite />} />
          <Route path="/edit/:id" element={<EditSite />} />
          <Route path="/responses/:id" element={<Responses />} />
          <Route path="/:slug" element={<ValentineSite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
