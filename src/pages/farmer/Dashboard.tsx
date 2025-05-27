import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/services/api';
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your products and inventory</p>
                <Button
                  className="mt-4 w-full bg-organic-green hover:bg-organic-green-dark"
                  onClick={() => navigate('/farmer/products')}
                >
                  View Products
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View and manage customer orders</p>
                <Button
                  className="mt-4 w-full bg-organic-green hover:bg-organic-green-dark"
                  onClick={() => navigate('/farmer/orders')}
                >
                  View Orders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View your sales and performance metrics</p>
                <Button
                  className="mt-4 w-full bg-organic-green hover:bg-organic-green-dark"
                  onClick={() => navigate('/farmer/analytics')}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerDashboard; 