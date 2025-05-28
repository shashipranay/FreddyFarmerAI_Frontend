import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TradeManagement } from '@/components/TradeManagement';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AddProduct from '@/pages/farmer/AddProduct';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import ForFarmers from "./pages/ForFarmers";
import HowItWorks from "./pages/HowItWorks";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import AIAnalytics from "./pages/farmer/AIAnalytics";
import FarmerDashboard from "./pages/farmer/Dashboard";
import Expenses from "./pages/farmer/Expenses";
import Trades from "./pages/farmer/Trades";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/for-farmers" element={<ForFarmers />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/:role" element={<Register />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/ai-analytics" element={<AIAnalytics />} />
              <Route path="/farmer/expenses" element={<Expenses />} />
              <Route path="/farmer/trades" element={<Trades />} />
              <Route path="/farmer/add-product" element={<AddProduct />} />
              <Route path="/trades" element={
                <ProtectedRoute>
                  <TradeManagement />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
