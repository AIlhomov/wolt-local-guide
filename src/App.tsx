import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Login, UserRole } from "@/components/Login";
import { OwnerDashboard } from "@/components/OwnerDashboard";
import CalorieScanner from "@/components/CalorieScanner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [role, setRole] = useState<UserRole>(null);

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/scanner" element={<CalorieScanner />} />
            {!role && <Route path="/*" element={<Login onLogin={setRole} />} />}
            {role === "customer" && <Route path="/*" element={<Index onLogout={handleLogout} />} />}
            {role === "owner" && <Route path="/*" element={<OwnerDashboard onLogout={handleLogout} />} />}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
