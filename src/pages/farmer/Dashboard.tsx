import FarmerProducts from '@/components/FarmerProducts';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/services/api';
import { BarChart, DollarSign, Package, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.logout();
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

  const dashboardItems = [
    {
      title: 'AI Analytics',
      description: 'View AI-powered insights and predictions',
      icon: <BarChart className="h-6 w-6" />,
      onClick: () => navigate('/farmer/ai-analytics'),
    },
    {
      title: 'Expenses',
      description: 'Track and manage your farm expenses',
      icon: <DollarSign className="h-6 w-6" />,
      onClick: () => navigate('/farmer/expenses'),
    },
    {
      title: 'Trades',
      description: 'Manage your trades and transactions',
      icon: <TrendingUp className="h-6 w-6" />,
      onClick: () => navigate('/farmer/trades'),
    },
    {
      title: 'Products',
      description: 'Manage your products and inventory',
      icon: <Package className="h-6 w-6" />,
      onClick: () => navigate('/farmer/add-product'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardItems.map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={item.onClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                  {item.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <FarmerProducts />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerDashboard; 