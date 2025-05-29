import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Pages
import About from '@/pages/About';
import ForFarmers from '@/pages/ForFarmers';
import HowItWorks from '@/pages/HowItWorks';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Marketplace from '@/pages/Marketplace';
import Register from '@/pages/Register';

// Farmer Pages
import AddProduct from '@/pages/farmer/AddProduct';
import AIAnalytics from '@/pages/farmer/AIAnalytics';
import FarmerDashboard from '@/pages/farmer/Dashboard';
import Expenses from '@/pages/farmer/Expenses';
import Trades from '@/pages/farmer/Trades';

// Customer Pages
import AIInsights from '@/pages/customer/AIInsights';
import Cart from '@/pages/customer/Cart';
import Chat from '@/pages/customer/Chat';
import CustomerDashboard from '@/pages/customer/Dashboard';

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
              <Route path="/for-farmers" element={<ForFarmers />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/:role" element={<Register />} />
              
              {/* Farmer Routes */}
              <Route path="/farmer/dashboard" element={
                <ProtectedRoute requiredRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/farmer/ai-analytics" element={
                <ProtectedRoute requiredRole="farmer">
                  <AIAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/farmer/expenses" element={
                <ProtectedRoute requiredRole="farmer">
                  <Expenses />
                </ProtectedRoute>
              } />
              <Route path="/farmer/trades" element={
                <ProtectedRoute requiredRole="farmer">
                  <Trades />
                </ProtectedRoute>
              } />
              <Route path="/farmer/add-product" element={
                <ProtectedRoute requiredRole="farmer">
                  <AddProduct />
                </ProtectedRoute>
              } />

              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute requiredRole="buyer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute requiredRole="buyer">
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute requiredRole="buyer">
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/ai-insights" element={
                <ProtectedRoute requiredRole="buyer">
                  <AIInsights />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute requiredRole="buyer">
                  <Marketplace />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
