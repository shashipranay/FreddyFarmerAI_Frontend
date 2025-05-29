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
import { auth } from '@/services/api';
import { BarChart, LogOut, MessageSquare, ShoppingCart, Store, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerNav = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();

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
    <div className="flex items-center space-x-4">
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
        onClick={() => navigate('/cart')}
        className="text-gray-700 hover:text-organic-green"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Cart
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate('/chat')}
        className="text-gray-700 hover:text-organic-green"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        Chat
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate('/ai-insights')}
        className="text-gray-700 hover:text-organic-green"
      >
        <BarChart className="h-5 w-5 mr-2" />
        AI Insights
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
          <DropdownMenuItem onClick={() => navigate('/customer/dashboard')}>
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomerNav; 