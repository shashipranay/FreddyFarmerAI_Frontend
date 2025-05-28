import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut, Plus, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { t } = useLanguage();
  const { isAuthenticated, isFarmer, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-organic-green">
              Green Harvest
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/marketplace" className="text-gray-600 hover:text-organic-green">
                  {t('marketplace')}
                </Link>
                {isFarmer && (
                  <>
                    <Link to="/farmer/ai-analytics" className="text-gray-600 hover:text-organic-green">
                      AI Analytics
                    </Link>
                    <Link to="/farmer/expenses" className="text-gray-600 hover:text-organic-green">
                      Expenses
                    </Link>
                    <Link to="/farmer/trades" className="text-gray-600 hover:text-organic-green">
                      Trades
                    </Link>
                  </>
                )}
                <Link to="/about" className="text-gray-600 hover:text-organic-green">
                  {t('about')}
                </Link>
              </>
            ) : (
              <>
                <Link to="/how-it-works" className="text-gray-600 hover:text-organic-green">
                  {t('howItWorks')}
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-organic-green">
                  {t('about')}
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-organic-green text-organic-green hover:bg-organic-green hover:text-white transition-all duration-300">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register/farmer">
                  <Button className="bg-gradient-to-r from-organic-green to-organic-green-dark hover:from-organic-green-dark hover:to-organic-green shadow-lg transition-all duration-300">
                    Join as Farmer
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-organic-green text-organic-green hover:bg-organic-green hover:text-white transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(isFarmer ? '/farmer/dashboard' : '/marketplace')}>
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  {isFarmer && (
                    <DropdownMenuItem onClick={() => navigate('/farmer/add-product')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
