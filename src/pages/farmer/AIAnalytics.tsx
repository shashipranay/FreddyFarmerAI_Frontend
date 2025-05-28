import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { farmer } from '@/services/api';
import { AlertTriangle, BarChart, DollarSign, LineChart, Package, PieChart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SalesDataPoint {
  date: string;
  revenue: number;
}

interface ProductData {
  name: string;
  quantity: number;
  revenue: number;
}

interface InventoryData {
  category: string;
  quantity: number;
  percentage: number;
}

interface StockLevel {
  product: string;
  current: number;
  minimum: number;
  maximum: number;
}

interface AnalyticsData {
  totalRevenue: number;
  revenueChange: number;
  activeProducts: number;
  newProducts: number;
  lowStockAlerts: number;
  salesTrend: SalesDataPoint[];
  topProducts: ProductData[];
  inventoryDistribution: InventoryData[];
  stockLevels: StockLevel[];
  predictions: {
    sales: string;
    inventory: string;
    market: string;
  };
}

const AIAnalytics = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await farmer.getAIAnalytics({
        period,
        metrics: ['sales', 'inventory', 'predictions'],
        filters: {
          category: 'all',
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          }
        }
      });
      setAnalytics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000, // Show for 5 seconds
      });
      
      // If it's an AI service error, show a more detailed message
      if (errorMessage.includes('AI service')) {
        setAnalytics({
          totalRevenue: 0,
          revenueChange: 0,
          activeProducts: 0,
          newProducts: 0,
          lowStockAlerts: 0,
          salesTrend: [],
          topProducts: [],
          inventoryDistribution: [],
          stockLevels: [],
          predictions: {
            sales: 'AI service is currently unavailable. Please try again later.',
            inventory: 'AI service is currently unavailable. Please try again later.',
            market: 'AI service is currently unavailable. Please try again later.'
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      // Here you would typically call an API endpoint to generate a report
      await farmer.getAIAnalytics({
        period,
        metrics: ['report'],
        filters: {
          category: 'all',
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          }
        }
      });
      toast({
        title: 'Success',
        description: 'Report generation started. You will receive it shortly.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-green"></div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={fetchAnalytics}
            className="bg-organic-green hover:bg-organic-green-dark"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Analytics Dashboard</h1>
            <div className="flex space-x-4">
              <Select value={period} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => setPeriod(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="bg-organic-green hover:bg-organic-green-dark"
                onClick={handleGenerateReport}
              >
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics?.totalRevenue?.toFixed(2) ?? '0.00'}</div>
                <p className={`text-xs ${(analytics?.revenueChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(analytics?.revenueChange ?? 0) >= 0 ? '+' : ''}{analytics?.revenueChange ?? 0}% from last {period}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.activeProducts ?? 0}</div>
                <p className="text-xs text-green-600">+{analytics?.newProducts ?? 0} new this {period}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.lowStockAlerts ?? 0}</div>
                <p className="text-xs text-red-600">Products need attention</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Insights</TabsTrigger>
              <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                      {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
                      ) : (
                        <LineChart className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                      {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
                      ) : (
                        <BarChart className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                      {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
                      ) : (
                        <PieChart className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Level Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                      {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
                      ) : (
                        <TrendingUp className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-800">Sales Prediction</h3>
                        <p className="text-green-600">{analytics?.predictions?.sales ?? 'No sales prediction available'}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800">Inventory Recommendation</h3>
                        <p className="text-blue-600">{analytics?.predictions?.inventory ?? 'No inventory recommendation available'}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-800">Market Opportunity</h3>
                        <p className="text-purple-600">{analytics?.predictions?.market ?? 'No market insights available'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIAnalytics; 