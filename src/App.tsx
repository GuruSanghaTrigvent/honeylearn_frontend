import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TopNav from "./components/TopNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TopicDetail from "./pages/TopicDetail";
import LessonDetail from "./pages/LessonDetail";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";
import SignUpFlow from "./pages/auth/SignUpFlow";
import LoginPage from "./pages/auth/LoginPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Index from "./pages/Index";
import { trackPageView } from "./utils/analytics";
import * as MetaPixel from "./utils/metaPixel";
import { TestVoiceChat } from "./components/TestVoiceChat";

const queryClient = new QueryClient();

// Page tracker component
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Get page title based on path
    const getPageTitle = (path: string) => {
      if (path === "/") return "Home";
      if (path === "/index") return "Index";
      if (path === "/signup") return "Sign Up";
      if (path === "/login") return "Login";
      if (path === "/dashboard") return "Dashboard";
      if (path === "/parents") return "Parent Dashboard";
      if (path === "/terms") return "Terms of Service";
      if (path === "/privacy") return "Privacy Policy";
      if (path.includes("/topic/")) return "Topic Detail";
      if (path.includes("/lesson/")) return "Lesson Detail";
      return "Page Not Found";
    };

    const pageTitle = getPageTitle(location.pathname);
    // Track with Google Analytics
    trackPageView(location.pathname, pageTitle);

    // Track with Meta Pixel
    MetaPixel.trackPageView(location.pathname);
  }, [location]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Toaster />
            <Sonner />
            <TopNav />
            <PageTracker />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/index" element={<Index />} />
                <Route path="/signup" element={<SignUpFlow />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/topic/:topicId" element={<TopicDetail />} />
                <Route path="/lesson/:lessonId" element={<LessonDetail />} />
                <Route path="/parents" element={<ParentDashboard />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/test-voice-chat" element={<TestVoiceChat />} />
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
