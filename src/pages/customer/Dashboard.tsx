import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { customer } from '@/services/api';
import { BarChart, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string }[];
  farmer: {
    name: string;
  };
  category: string;
  description: string;
}

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
  quantity: number;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [marketInsights, setMarketInsights] = useState({
    trendingProducts: [],
    priceChanges: [],
    recommendations: []
  });

  const fetchOrders = async () => {
    try {
      const response = await customer.getOrders();
      if (response.orders) {
        setRecentOrders(response.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsResponse, insightsResponse] = await Promise.all([
        customer.getProducts(),
        customer.getMarketInsights()
      ]);

      await fetchOrders();
      setAvailableProducts(productsResponse.products || []);
      setMarketInsights(insightsResponse || {
        trendingProducts: [],
        priceChanges: [],
        recommendations: []
      });
    } catch (error) {
      toast.toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling for order updates every 30 seconds
    const orderPollingInterval = setInterval(fetchOrders, 30000);
    
    return () => {
      clearInterval(orderPollingInterval);
    };
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await customer.addToCart(productId);
      toast.toast({
        title: 'Success',
        description: 'Product added to cart successfully',
        variant: 'default',
        duration: 3000
      });
    } catch (error) {
      toast.toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-green"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user?.name}!
          </h1>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentOrders.length}</div>
                <p className="text-xs text-gray-500">View your order history</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available Products</CardTitle>
                <Package className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableProducts.length}</div>
                <p className="text-xs text-gray-500">Browse marketplace</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Market Insights</CardTitle>
                <TrendingUp className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketInsights.trendingProducts.length}</div>
                <p className="text-xs text-gray-500">View market trends</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentOrders.slice(0, 3).map((order) => (
                <Card key={order._id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge 
                      variant={
                        order.status === 'completed' 
                          ? 'default' 
                          : order.status === 'cancelled' 
                            ? 'destructive' 
                            : 'secondary'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    {order.products.map((item) => (
                      <div key={`${order._id}-${item.product._id}`} className="flex justify-between text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Products */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Available Products</h2>
              <Button
                onClick={() => navigate('/marketplace')}
                variant="outline"
                className="text-organic-green"
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableProducts.slice(0, 4).map((product) => (
                <Card key={product._id}>
                  <CardContent className="p-4">
                    <img
                      src={product.images?.[0]?.url || 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables';
                      }}
                    />
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">₹{(product.price || 0).toFixed(2)}</span>
                      <Button
                        onClick={() => handleAddToCart(product._id)}
                        size="sm"
                        className="bg-organic-green hover:bg-organic-green-dark"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Market Insights</h2>
              <Button
                onClick={() => navigate('/ai-insights')}
                variant="outline"
                className="text-organic-green"
              >
                View Details
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {marketInsights.trendingProducts.slice(0, 3).map((product: { name: string; trend: string; _id?: string }, index: number) => (
                <Card key={product._id || `trending-${index}`} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.trend}</p>
                    </div>
                    <BarChart className="h-4 w-4 text-organic-green" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
