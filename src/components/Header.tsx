import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { auth } from '@/services/api';
import { BarChart, Globe, LogOut, Plus, Store, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNav from './CustomerNav';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isFarmer = user?.role === 'farmer';

  const handleLogout = async () => {
    try {
      await auth.logout();
      logout();
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-organic-green">
              FreddyFarmer
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('hi')}>
                  हिंदी
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('mr')}>
                  मराठी
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/how-it-works')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  How It Works
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/about')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  About Me
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register/farmer')}
                  className="bg-organic-green hover:bg-organic-green-dark"
                >
                  Register as Farmer
                </Button>
                <Button
                  onClick={() => navigate('/register/buyer')}
                  className="bg-organic-green hover:bg-organic-green-dark"
                >
                  Register as Customer
                </Button>
              </>
            ) : isFarmer ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/farmer/dashboard')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  <User className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/farmer/add-product')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Product
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/marketplace')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  <Store className="h-5 w-5 mr-2" />
                  My Products
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/marketplace')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  <Store className="h-5 w-5 mr-2" />
                  Marketplace
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/farmer/ai-analytics')}
                  className="text-gray-700 hover:text-organic-green"
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  AI Analytics
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/farmer/expenses')}>
                      <BarChart className="h-4 w-4 mr-2" />
                      Expenses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <CustomerNav />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
